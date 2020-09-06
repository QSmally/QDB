
"use strict";

const PartialConnection = require("./PartialConnection.js");
const {Schema} = require("../Utility/Schema");

const FS     = require("fs");
const Qulity = require("qulity");
const SQL    = require("better-sqlite3");

class Connection extends PartialConnection {

    /**
     * The main interface for interacting with QDB.
     * @param {Pathlike} PathURL Path to the database file of this Connection.
     * @param {RawOptions} [RawOptions] Options for this Connection.
     * @param {Pool} [_Pool] Pool reference when this database was instantiated in a Pool.
     * @example const Users = new QDB.Connection("lib/Databases/Users.qdb");
     * @extends {PartialConnection}
     */
    constructor (PathURL, RawOptions = {}, _Pool = undefined) {

        if (FS.existsSync(PathURL)) {

            super();

            this.State = "CONNECTED";

            /**
             * Path string to the database.
             * @name Connection#Path
             * @type {Pathlike}
             * @readonly
             */
            Object.defineProperty(this, "Path", {
                enumerable: true,
                value: PathURL
            });

            /**
             * Options for this Connection.
             * @name Connection#ValOptions
             * @type {RawOptions}
             * @readonly
             */
            Object.defineProperty(this, "ValOptions", {
                value: Object.assign({
                    Table:  "QDB",
                    Schema: undefined,
                    WAL:    true,

                    Cache:     true,
                    FetchAll:  false,
                    UtilCache: true,
                    SweepInterval: 3600000,
                    SweepLifetime: 10800000,

                    SnapshotLifetime: 5,
                    BackupInterval:   21600000,
                    BackupDirectory:  "Databases/Backups/"
                }, RawOptions)
            });

            /**
             * Whether this Connection is used in a Pool.
             * @name Connection#Pool
             * @type {Pool|null}
             * @readonly
             */
            Object.defineProperty(this, "Pool", {
                enumerable: true,
                value: _Pool || null
            });

            /**
             * Table name of this Connection.
             * @name Connection#Table
             * @type {String}
             * @readonly
             */
            Object.defineProperty(this, "Table", {
                enumerable: true,
                value: this.ValOptions.Table || "QDB"
            });

            /**
             * Raw SQL property.
             * @name Connection#API
             * @type {SQL}
             * @link https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md
             * @private
             */
            Object.defineProperty(this, "API", {
                value: new SQL(PathURL)
            });

            /**
             * In-memory cached rows.
             * @name Connection#Cache
             * @type {DataStore}
             * @link https://github.com/QSmally/Qulity/blob/master/Documentation/DataStore.md
             * @private
             */
            Object.defineProperty(this, "Cache", {
                value: new Qulity.DataStore()
            })

        } else {
            return new PartialConnection();
        }

        if (!this.API) {
            return new PartialConnection();
        } else {
            this.API.exec(`CREATE TABLE IF NOT EXISTS '${this.Table}' ('Key' VARCHAR PRIMARY KEY, 'Val' TEXT);`);
            if (this.ValOptions.WAL) this.API.pragma("journal_mode = wal");
            this.API.pragma("synchronous = 2");
        }


        /**
         * An object with all additional active operators.
         * I.e. sweep intervals, backups, fetch all entries.
         * @name Connection#_Executors
         * @type {Object}
         * @private
         */
        const Executors = require("../Executors/_Index");
        Object.defineProperty(this, "_Executors", {value: {}});
        for (const Method in Executors) if (this.ValOptions[Method])
        this._Executors[Method] = Executors[Method](this);

    }


    /**
     * Retrieves all the rows of this database.
     * @name Connection#Size
     * @type {Number}
     */
    get Size () {
        if (!this._Ready) return 0;
        return this.API.prepare(`SELECT count(*) FROM '${this.Table}';`)
        .get()["count(*)"];
    }

    /**
     * Retrieves all the in-memory cached rows of this Connection.
     * Extension of what would be `<Connection>.Cache.size`, but checks for the ready state.
     * @name Connection#CacheSize
     * @type {Number}
     */
    get CacheSize () {
        if (!this._Ready) return 0;
        return this.Cache.size;
    }

    /**
     * Retrieves all the keys of this database table.
     * @name Connection#Indexes
     * @type {Array}
     */
    get Indexes () {
        if (!this._Ready) return [];
        return this.API.prepare(`SELECT Key FROM '${this.Table}';`)
        .all().map(Row => Row.Key);
    }

    /**
     * Disconnects from this Connection, clears in-memory rows.
     * Only run this method when you are exiting the program,
     * or want to fully disconnect from this database.
     * @returns {Connection}
     */
    Disconnect () {
        this.API.close();
        this.Cache.clear();
        this.State = "DISCONNECTED";

        clearInterval(this._Executors.SweepInterval);
        clearInterval(this._Executors.BackupInterval);

        return this;
    }


    // ---------------------------------------------------------------- Private methods

    /**
     * Internal method.
     * Checks whether this database is ready for execution.
     * @name Connection#_Ready
     * @type {Boolean}
     * @private
     */
    get _Ready () {
        if (this.State !== "CONNECTED") return false;
        if (!this.API.open) return false;
        return true;
    }

    /**
     * Internal method.
     * Resolves a dotaccess path or key and parses it.
     * @param {Pathlike} Pathlike String input to be formed and parsed.
     * @returns {Array<String, Array|undefined>} Array containnig a 'Key', and optionally a 'Path'.
     * @private
     */
    _Resolve (Pathlike) {
        const Path = Pathlike.split(/\.+/g);
        return [Path[0], Path.length > 1 ? Path.slice(1) : undefined];
    }

    /**
     * Internal method.
     * Sets or patches something in this Connection's internal cache.
     * @param {String|Number} Key As address to memory map this value.
     * @param {Object|Array} Value The value to cache in the memory.
     * @returns {DataStore} Returns the updated cache.
     * @link https://github.com/QSmally/Qulity/blob/master/Documentation/DataStore.md
     * @private 
     */
    _Patch (Key, Val) {
        const Value = Val instanceof Array ? [...Val] : {...Val};
        Value._Timestamp = Date.now();
        this.Cache.set(Key, Value);
        return this.Cache;
    }

    /**
     * Internal method.
     * Finds a relative dotaccess pathway of a frame.
     * @param {Object|Array} Frame The object-like beginning to cast.
     * @param {Array} Pathlike A dotaccess notation path as an Array. Preferred `Path` from `_Resolve`.
     * @param {Object} [Options] Additional queries for the caster to use.
     * @returns {*}
     * @private
     */
    _CastPath (Frame, Pathlike, {
        Item  = undefined,
        Erase = false,
        Push  = false
    } = {}) {
        const Original = Frame;
        const LastKey  = Pathlike.pop();

        for (let i = 0; i < Pathlike.length; i++) {
            if (typeof Frame !== "object") return undefined;
            if (!(Pathlike[i] in Frame)) {
                if (Item) Frame[Pathlike[i]] = {};
                else return undefined;
            }

            Frame = Frame[Pathlike[i]];
        }

        if (Item === undefined) {
            if (Erase) {
                if (Frame instanceof Array) Frame.splice(LastKey, 1);
                else delete Frame[LastKey];
                return Original;
            } else return Frame[LastKey];
        } else {
            if (Erase) {
                if (Frame instanceof Array) Frame.splice(Frame.indexOf(Item), 1);
                else delete Frame[LastKey];
            } else {
                if (Push && Frame[LastKey] instanceof Array) Frame[LastKey].push(Item);
                else typeof Frame == "object" ? Frame[LastKey] = Item : Frame = Item;
            }

            return Original;
        }
    }


    // ---------------------------------------------------------------- Integrations

    /**
     * Converts this database's rows into an Object. To use dotaccess, use `Fetch` instead.
     * @returns {Object} An object instance with the key/value pairs of this database.
     */
    AsObject () {
        if (!this._Ready) return null;
        return Object.fromEntries(this.API.prepare(`SELECT * FROM '${this.Table}';`)
        .all().map(Row => [Row.Key, JSON.parse(Row.Val)]));
    }

    /**
     * Converts this database, or a part of it using dotaccess, to a Manager instance.
     * @param {Pathlike} [Pathlike] Optional dotaccess path pointing towards what to serialise.
     * @param {Function} [Holds] Given optional class for which instance this Manager is for.
     * @returns {Manager} A Manager instance with the key/model pairs.
     * @link https://github.com/QSmally/Qulity/blob/master/Documentation/Manager.md
     */
    ToIntegratedManager (Pathlike = null, Holds = null) {
        if (!this._Ready) return null;
        
        if (Pathlike && typeof Pathlike !== "string") return null;
        const Iterable = typeof Pathlike !== "undefined" ? this.Fetch(Pathlike) :
        this.API.prepare(`SELECT * FROM '${this.Table}';`).all().map(Row => [Row.Key, JSON.parse(Row.Val)]);

        return new Qulity.Manager(Iterable, Holds);
    }

    /**
     * Creates a SQL transaction, which allows you to commit or rollback changes.
     * @returns {Transaction|undefined} A Transaction instance, or `undefined` when already in a transaction.
     */
    Transaction () {
        if (this.API.inTransaction) return undefined;
        const Transaction = require("../Utility/Transaction");
        return new Transaction(this);
    }


    // ---------------------------------------------------------------- Database methods

    /**
     * Manages the elements of the database.
     * @param {Pathlike} KeyOrPath Specifies at what row to insert or replace the element at. Use dotaccess notation to edit properties.
     * @param {Object|Array|*} Value Data to set at the row address, at the location of the key or path.
     * @returns {Connection} Returns the updated database.
     */
    Set (KeyOrPath, Value) {
        if (!this._Ready)                  return null;
        if (typeof KeyOrPath !== "string") return null;
        if (Value === undefined)           return null;

        if (Value && typeof Value === "object") delete Value._DataStore;
        const [Key, Path] = this._Resolve(KeyOrPath);

        if (typeof Path !== "undefined") Value = this._CastPath(this.Fetch(Key) || {}, Path, {Item: Value});
        else if (typeof Value !== "object") return null;
        
        if (this.Cache.has(Key)) this._Patch(Key, Value);
        this.API.prepare(`INSERT OR REPLACE INTO '${this.Table}' ('Key', 'Val') VALUES (?, ?);`)
        .run(Key, JSON.stringify(Value));

        return this;
    }

    /**
     * Manages the retrieval of the database.
     * @param {Pathlike} KeyOrPath Specifies which row to fetch or get from cache. Use dotaccess to retrieve properties.
     * @param {Boolean} [Cache] Whether to, if not already, cache this entry in results that the next retrieval would be much faster.
     * @returns {Object|Array|DataModel|*} Value of the row, or the property when using dotaccess.
     */
    Fetch (KeyOrPath, Cache = this.ValOptions.Cache) {
        if (!this._Ready) return null;
        if (typeof KeyOrPath !== "string") return null;
        const [Key, Path] = this._Resolve(KeyOrPath);

        let Fetched = this.Cache.resolve(Key) || (() => {
            const Req = this.API.prepare(`SELECT Val FROM '${this.Table}' WHERE Key = ?;`).get(Key);
            if (typeof Req !== "undefined") return JSON.parse(Req.Val);
            else return Req;
        })();

        if (Fetched === null || Fetched === undefined) return Fetched;
        if (Cache && !this.Cache.has(Key)) this._Patch(Key, Fetched);

        Fetched = Fetched instanceof Array ? [...Fetched] : {...Fetched};
        if (typeof Path !== "undefined") Fetched = this._CastPath(Fetched, Path);
        if (typeof Fetched === "object") delete Fetched._Timestamp;

        return Fetched;
    }

    /**
     * Erases elements from this Connection's internal cache.
     * @param {...Pathlike} [Keys] A key or multiple keys to remove from cache. If none, the cache will get cleared entirely.
     * @returns {Connection} Returns the updated database.
     */
    Evict (...Keys) {
        if (!this._Ready) return null;
        if (!(Keys instanceof Array)) return null;

        Keys = Keys.filter(KeyOrPath => typeof KeyOrPath === "string")
        .map(KeyOrPath => this._Resolve(KeyOrPath)[0]);

        if (!Keys.length) this.Cache.clear();
        else for (const Key of Keys) this.Cache.delete(Key);
        return this;
    }

    /**
     * Manages the deletion of the database.
     * @param {...Pathlike} Keys A key or multiple keys to remove from the database.
     * These elements will also get removed from this Connection's internal cache.
     * @returns {Connection} Returns the updated database.
     */
    Erase (...Keys) {
        if (!this._Ready) return null;
        if (!(Keys instanceof Array)) return null;

        Keys = Keys.filter(KeyOrPath => typeof KeyOrPath === "string")
        .map(KeyOrPath => this._Resolve(KeyOrPath)[0]);
            
        if (Keys.length) {
            for (const Key of Keys)
            this.API.prepare(`DELETE FROM '${this.Table}' WHERE Key = ?;`).run(Key);
            this.Evict(...Keys);
        }

        return this;
    }


    // ---------------------------------------------------------------- Look up functions

    /**
     * Returns whether or not a row in this database exists.
     * This method also caches the row internally, so getting it would be much faster.
     * @param {Pathlike} Key Specifies which row to see if it exists.
     * @param {Boolean} [Cache] Whether or not to cache the fetched entry.
     * @returns {Boolean} Whether a row exists in this database.
     */
    Exists (Key, Cache = this.ValOptions.UtilCache) {
        if (!this._Ready) return false;
        if (typeof Key !== "string") return false;
        const Fetched = this.Fetch(Key, Cache);
        return Fetched !== undefined;
    }

    /**
     * Iterates through all the keys, returns the first element found.
     * @param {Function} Fn Function used to test with.
     * @param {Boolean} [Cache] Whether or not to cache the fetched entry.
     * @returns {*} Returns the row found, or nil.
     */
    Find (Fn, Cache = this.ValOptions.UtilCache) {
        if (!this._Ready) return null;
        if (typeof Fn !== "function") return null;

        for (const Key of this.Indexes)
        if (Fn(Key)) return this.Fetch(Key, Cache);

        return undefined;
    }

    /**
     * Accumulates as function on a row, essentially a fetch wrapped in a method.
     * Changes are not recorded on the database.
     * @param {Pathlike} KeyOrPath Specifies which row to fetch. Use dotaccess to retrieve properties.
     * @param {Function} Fn Callback function used to return the row or property.
     * @param {Boolean} [Cache] Whether or not to cache the fetched entry.
     * @returns {Connection} Returns the current Connection.
     */
    Accumulate (KeyOrPath, Fn, Cache = this.ValOptions.UtilCache) {
        if (!this._Ready)                  return null;
        if (typeof KeyOrPath !== "string") return null;
        if (typeof Fn !== "function")      return null;

        Fn(this.Fetch(KeyOrPath, Cache), KeyOrPath);

        return this;
    }

    /**
     * Iterates through this database's entries.
     * @param {Function} Fn A function which passes on the iterating entries.
     * @param {Boolean} [Evict] Whether to evict the entries from cache afterwards.
     * Disabling this option would increase memory usage indefinitely!
     * @returns {Connection} Returns this database.
     */
    Each (Fn, Evict = true) {
        if (!this._Ready)               return null;
        if (typeof Fn !== "function")   return null;
        if (typeof Evict !== "boolean") return null;

        const CacheSweep = [];

        for (const Idx of this.Indexes) {
            if (Evict && !this.Cache.has(Idx))
            CacheSweep.push(Idx);
            Fn(this.Fetch(Idx), Idx);
        }

        if (Evict) this.Evict(...CacheSweep);

        return this;
    }

    /**
     * Locally filters out rows in memory to work with. Please note that this method does
     * increase memory usage in large databases, although the fetched entries will get evicted.
     * @param {Function} Fn A filter function which returns a boolean, based on the value(s) of the rows.
     * @returns {Selection} A Selection class instance.
     */
    Select (Fn = () => true) {
        if (!this._Ready) return null;
        if (typeof Fn !== "function") return null;

        const Results = {};

        this.Each((Row, Key) => {
            if (Fn(Row, Key))
            Results[Key] = Row;
        });

        const Selection = require("../Utility/Selection");
        return new Selection(Results);
    }


    // ---------------------------------------------------------------- Array methods

    /**
     * Pushes something to an array at the path output.
     * @param {Pathlike} KeyOrPath Specifies which row or nested array to push to.
     * @param {...Any} Values Values to insert and push to this array.
     * @returns {Connection} Returns the updated database.
     */
    Push (KeyOrPath, ...Values) {
        if (!this._Ready)                  return null;
        if (typeof KeyOrPath !== "string") return null;
        if (!(Values instanceof Array))    return null;
        
        const Origin = this.Fetch(KeyOrPath);
        if (!(Origin instanceof Array)) return null;

        Origin.push(...Values);
        this.Set(KeyOrPath, Origin);

        if (!this.ValOptions.UtilCache)
        this.Evict(KeyOrPath);
        return this;
    }

    /**
     * Inserts (if defined) or removes a value to/from the front of the array.
     * @param {Pathlike} KeyOrPath Specifies which row or nested array to insert to/remove from.
     * @param {...Any} [Values] If defined, inserts new values at the front of the array.
     * @returns {Number|*} New length of the array if a value was inserted, or the shifted value.
     */
    Shift (KeyOrPath, ...Values) {
        if (!this._Ready)                  return null;
        if (typeof KeyOrPath !== "string") return null;
        if (!(Values instanceof Array))    return null;

        let Shifted  = undefined;
        const Origin = this.Fetch(KeyOrPath);
        if (!(Origin instanceof Array)) return null;

        if (Values.length)
        Origin.unshift(...Values);
        else Shifted = Origin.shift();

        this.Set(KeyOrPath, Origin);
        if (!this.ValOptions.UtilCache)
        this.Evict(KeyOrPath);

        return !Values.length ? Shifted : Origin.length;
    }

    /**
     * Pops something from an array at the path output.
     * @param {Pathlike} KeyOrPath Specifies which row or nested array to pop from.
     * @returns {*} Returns the popped value.
     */
    Pop (KeyOrPath) {
        if (!this._Ready) return null;
        if (typeof KeyOrPath !== "string") return null;

        const Origin = this.Fetch(KeyOrPath);
        if (!(Origin instanceof Array)) return null;

        const Popped = Origin.pop();
        this.Set(KeyOrPath, Origin);

        if (!this.ValOptions.UtilCache)
        this.Evict(KeyOrPath);
        return Popped;
    }

    /**
     * Removes a specific element from this endpoint array.
     * @param {Pathlike} KeyOrPath Specifies which row or nested array to remove from.
     * @param {Function} Fn A function that returns a boolean to which value to remove.
     * @returns {Connection} Returns the updated database.
     */
    Remove (KeyOrPath, Fn) {
        if (!this._Ready)                  return null;
        if (typeof KeyOrPath !== "string") return null;
        if (typeof Fn !== "function")      return null;

        const Origin = this.Fetch(KeyOrPath);
        if (!(Origin instanceof Array)) return null;

        for (const Key in Origin)
        if (Fn(Origin[Key], Key)) {
            Origin.splice(Key, 1);
            break;
        }

        this.Set(KeyOrPath, Origin);

        if (!this.ValOptions.UtilCache)
        this.Evict(KeyOrPath);
        return this;
    }


    // ---------------------------------------------------------------- Utility methods

    /**
     * Inserts an input into a row or nested object if the key or path wasn't found at the endpoint.
     * It can be used as a default schema of the database elements, that gets inserted if there's no entry already.
     * @param {Pathlike} KeyOrPath Context key to see if it exists, either a row or nested property, and optionally insert the new value.
     * @param {*} Input A value to input if the row or nested property wasn't found in the database.
     * @returns {Boolean} Whether or not the new value was inserted.
     */
    Ensure (KeyOrPath, Input) {
        if (!this._Ready)                  return null;
        if (typeof KeyOrPath !== "string") return null;
        if (typeof Input === "undefined")  return null;

        const Origin = this.Fetch(KeyOrPath);

        if (typeof Origin === "undefined") {
            const Val = Input instanceof Schema ? Input.Model : Input;
            this.Set(KeyOrPath, Val);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Updates a value in the database by fetching it and passing it onto the callback function.
     * @param {Pathlike} KeyOrPath Specifies which row or nested property to fetch.
     * @param {Function} Fn Callback which includes the original value of the fetched row or property.
     * @returns {*} Returns the new row of the updated property.
     */
    Modify (KeyOrPath, Fn) {
        if (!this._Ready)                  return null;
        if (typeof KeyOrPath !== "string") return null;
        if (typeof Fn !== "function")      return null;

        const Updated = Fn(this.Fetch(KeyOrPath));
        this.Set(KeyOrPath, Updated);

        return this.Fetch(this._Resolve(KeyOrPath)[0]);
    }

    /**
     * Inverts a boolean, from true to false and vice-versa, at the endpoint of the path.
     * @param {Pathlike} KeyOrPath Specifies which row or nested property to boolean-invert.
     * @returns {Boolean} Updated boolean value of the property.
     */
    Invert (KeyOrPath) {
        if (!this._Ready) return null;
        if (typeof KeyOrPath !== "string") return null;

        const Origin = this.Fetch(KeyOrPath);
        if (typeof Origin !== "boolean") return null;

        this.Set(KeyOrPath, !Origin);
        return !Origin;
    }

}

module.exports = Connection;


/**
 * Options for a database Connection.
 * All integer related options are in milliseconds.
 * @typedef {Object} RawOptions

 * @param {String} Table A name for the table to use at this path for this Connection.
 * @param {Schema} Schema Link to a database Schema class for automatic data migration.
 * @param {Boolean} WAL Whether or not to enable Write Ahead Logging mode.

 * @param {Boolean} Cache Whether to enable in-memory caching of entries in results that the next retrieval would be much faster.
 * @param {Boolean} FetchAll Whether or not to fetch all the database entries on start-up of this database Connection.
 * @param {Boolean} UtilCache Whether or not to cache entries while performing utility tasks, such as the Exists and Accumulate methods.
 * @param {Number} SweepInterval Integer to indicate at what interval to sweep the entries of this Connection's internal cache.
 * @param {Number} SweepLifetime The minimum age of an entry in the cache to consider being sweepable after an interval.

 * @param {Number} SnapshotLifetime After how many intervals to merge the latest snapshot backups into one.
 * @param {Number} BackupInterval Integer to indicate at what interval to create a snapshot backup, or merge the snapshots.
 * @param {Pathlike} BackupDirectory A path URL to the directory to insert all the database backups in.
 */
