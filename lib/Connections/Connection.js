
"use strict";

const {Schema} = require("../Utility/Schema");

const Qulity = require("qulity");
const SQL    = require("better-sqlite3");

class Connection {

    /**
     * The main interface for interacting with QDB.
     * @param {Pathlike} PathURL Path to the database file of this Connection.
     * @param {RawOptions} [RawOptions] Options for this Connection.
     * @param {Pool} [_Pool] Reference to a Pool if this database was instantiated in a Pool.
     * @example const Users = new QDB.Connection("lib/Databases/Users.qdb");
     */
    constructor (PathURL, RawOptions = {}, _Pool = undefined) {

        /**
         * Current state of this Connection.
         * @name Connection#State
         * @type {String}
         * @readonly
         */
        Object.defineProperty(this, "State", {
            enumerable: true,
            writable:   true,
            value:      "CONNECTED"
        });

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
            value: {
                Table:  "QDB",
                Schema: undefined,
                WAL:    true,

                Cache:     true,
                FetchAll:  false,
                UtilCache: true,

                CacheMaxSize:  false,
                SweepInterval: 300000,
                SweepLifetime: 150000,

                ...RawOptions
            }
        });

        /**
         * Reference to the Pool this Connection was created in.
         * @name Connection#Pool
         * @type {Pool?}
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
            value: new Qulity.Collection()
        });


        if (!this.API) {
            throw new Error("A QDB Connection could not be created.");
        } else {
            this.API.prepare(`CREATE TABLE IF NOT EXISTS '${this.Table}' ('Key' VARCHAR PRIMARY KEY, 'Val' TEXT);`).run();
            this.API.pragma(`journal_mode = ${this.ValOptions.WAL ? "wal" : "delete"};`);
            this.API.pragma("cache_size = 64000;");
            this.API.pragma("synchronous = 1;");
        }


        /**
         * An object with all additional active operators.
         * I.e. sweep intervals, backups, fetch all entries.
         * @name Connection#_Executors
         * @type {Object}
         * @private
         */
        const Executors = require("./Executors/Index");
        Object.defineProperty(this, "_Executors", {value: {}});
        for (const Method in Executors) if (this.ValOptions[Method])
        this._Executors[Method] = Executors[Method](this);

    }


    /**
     * Retrieves all the rows of this Connection.
     * @name Connection#Size
     * @type {Number}
     */
    get Size () {
        if (!this._Ready) return 0;
        return this.API.prepare(`SELECT COUNT(*) FROM '${this.Table}';`)
        .get()["COUNT(*)"];
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

        return this;
    }


    // ---------------------------------------------------------------- Private methods

    /**
     * Internal getter.
     * Checks whether this database is ready for execution.
     * @name Connection#_Ready
     * @type {Boolean}
     * @private
     */
    get _Ready () {
        return this.State === "CONNECTED" && this.API.open;
    }

    /**
     * Internal method.
     * Resolves a dotaccess path or key and parses it.
     * @param {Pathlike} Pathlike String input to be formed and parsed.
     * @returns {Array<String, Array?>} Array containnig a 'Key' and an optional 'Path'.
     * @private
     */
    _Resolve (Pathlike) {
        const Path = Pathlike.split(/\.+/g);
        return [Path[0], Path.length > 1 ? Path.slice(1) : undefined];
    }

    /**
     * Internal method.
     * Inserts or patches something in this Connection's internal cache.
     * @param {String|Number} Key As address to memory map this value to.
     * @param {Object|Array} Val The value to set in the memory cache.
     * @returns {Collection} Returns the updated cache instance of this Connection.
     * @link https://github.com/QSmally/Qulity/blob/master/Documentation/Collection.md
     * @private 
     */
    _Patch (Key, Val) {
        if (this.ValOptions.CacheMaxSize &&
            this.Cache.size >= this.ValOptions.CacheMaxSize &&
            !this.Cache.has(Key)) return this.Cache;

        const Value = Val instanceof Array ? [...Val] : {...Val};
        Value._Timestamp = Date.now();
        this.Cache.set(Key, Value);
    
        return this.Cache;
    }

    /**
     * Internal method.
     * Finds a relative dotaccess pathway of an object.
     * @param {Object|Array} Frame The object-like beginning to cast.
     * @param {Array} Pathlike A dotaccess notation path as an Array. Preferred `Path` value from `_Resolve()`.
     * @param {*} [Item] A value to cast into the inputted frame object.
     * @returns {*} Returns the output of the caster.
     * @private
     */
    _CastPath (Frame, Pathlike, Item = undefined) {
        const Original = Frame;
        const LastKey  = Pathlike.pop();

        for (let i = 0; i < Pathlike.length; i++) {
            if (!Frame || typeof Frame !== "object") return undefined;
            if (!(Pathlike[i] in Frame)) {
                if (Item) Frame[Pathlike[i]] = {};
                else return undefined;
            }

            Frame = Frame[Pathlike[i]];
        }

        if (Frame) {
            if (Item === undefined) return Frame[LastKey];
            Frame[LastKey] = Item;
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
        return Object.fromEntries(this.API.prepare(`SELECT Key, Val FROM '${this.Table}';`)
        .all().map(Row => [Row.Key, JSON.parse(Row.Val)]));
    }

    /**
     * Converts this database, or a part of it using dotaccess, to a Manager instance.
     * @param {Pathlike} [Pathlike] Optional dotaccess path pointing towards what to serialise.
     * @param {Function} [Holds] Given optional class for which instance this Manager is for.
     * @returns {Manager} A Manager instance with the key/model pairs.
     * @link https://github.com/QSmally/Qulity/blob/master/Documentation/BaseManager.md
     */
    ToIntegratedManager (Pathlike = null, Holds = null) {
        if (!this._Ready) return null;
        
        if (Pathlike && typeof Pathlike !== "string") return null;
        const Iterable = typeof Pathlike !== "undefined" ? this.Fetch(Pathlike) :
        this.API.prepare(`SELECT Key, Val FROM '${this.Table}';`).all().map(Row => [Row.Key, JSON.parse(Row.Val)]);

        return new Qulity.Manager(Iterable, Holds);
    }

    /**
     * Creates a SQL transaction, which allows you to commit or rollback changes.
     * @returns {Transaction?} A Transaction instance, or a nil value when already in a transaction.
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
     * @param {Object|Array|DataModel|*} Value Data to set at the row address, at the location of the key or path.
     * @returns {Connection} Returns the current Connection.
     */
    Set (KeyOrPath, Value) {
        if (!this._Ready)                  return null;
        if (typeof KeyOrPath !== "string") return null;
        if (Value === undefined)           return null;

        const [Key, Path] = this._Resolve(KeyOrPath);
        
        if (typeof Path !== "undefined") Value = this._CastPath(this.Fetch(Key) || {}, Path, Value);
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

        let Fetched = this.Cache.get(Key) || (() => {
            const Req = this.API.prepare(`SELECT Val FROM '${this.Table}' WHERE Key = ?;`).get(Key);
            if (typeof Req !== "undefined") return JSON.parse(Req.Val);
            else return Req;
        })();

        if (Fetched === null || Fetched === undefined) return Fetched;
        if (Cache && !this.Cache.has(Key)) this._Patch(Key, Fetched);

        Fetched = Fetched instanceof Array ? [...Fetched] : {...Fetched};
        if (typeof Path !== "undefined") Fetched = this._CastPath(Fetched, Path);
        if (Fetched && typeof Fetched === "object") delete Fetched._Timestamp;

        return Fetched;
    }

    /**
     * Erases elements from this Connection's internal cache.
     * @param {...Pathlike} [Keys] A key or multiple keys to remove from cache. If none, the cache will get cleared entirely.
     * @returns {Connection} Returns the current Connection.
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
     * @returns {Connection} Returns the current Connection.
     */
    Erase (...Keys) {
        if (!this._Ready) return null;
        if (!(Keys instanceof Array)) return null;

        Keys = Keys.filter(KeyOrPath => typeof KeyOrPath === "string")
        .map(KeyOrPath => this._Resolve(KeyOrPath)[0]);
            
        if (Keys.length) {
            this.Evict(...Keys);
            this.API.prepare(`DELETE FROM '${this.Table}'
                WHERE Key IN (${Keys.map(_ => "?").join(", ")})`
            ).run(...Keys);
        }

        return this;
    }


    // ---------------------------------------------------------------- Look up functions

    /**
     * Returns whether or not a row in this database exists. This method also caches
     * the row internally, so fetching it afterwards would be much faster.
     * @param {Pathlike} Key Specifies which row to see if it exists.
     * @param {Boolean} [Cache] Whether or not to cache the fetched entry.
     * @returns {Boolean} Whether or not a row exists in this database.
     */
    Exists (Key, Cache = this.ValOptions.UtilCache) {
        if (!this._Ready) return false;
        if (typeof Key !== "string") return false;
        const Fetched = this.Fetch(Key, Cache);
        return Fetched !== undefined;
    }

    /**
     * Iterates through this database's entries.
     * @param {Function} Fn A function which passes on the iterating entries.
     * @returns {Connection} Returns the current Connection.
     */
    Each (Fn) {
        if (!this._Ready) return null;
        if (typeof Fn !== "function") return null;

        for (const Entry of this.API.prepare(`SELECT Key, Val FROM '${this.Table}';`).all())
        Fn(JSON.parse(Entry.Val), Entry.Key);

        return this;
    }

    /**
     * Iterates through all the entries of the database, returns the first element found.
     * @param {Function} Fn A tester function which returns a boolean, based on the value(s) of the rows.
     * @returns {Object|Array|DataModel} Returns the row which was found, or a nil value.
     */
    Find (Fn) {
        if (!this._Ready) return null;
        if (typeof Fn !== "function") return null;

        if (this.ValOptions.Cache)
        for (const [Key, Val] of this.Cache)
        if (Fn(Val, Key)) return Val;

        for (const Entry of this.API.prepare(`SELECT Key, Val FROM '${this.Table}';`).iterate()) {
            const Column = JSON.parse(Entry.Val);
            if (Fn(Column, Entry.Key)) return Column;
        }

        return undefined;
    }

    /**
     * Locally filters out rows in memory to work with.
     * Please note that this method does increase memory usage in large databases.
     * @param {Function|Pathlike} FnOrPath A filter function or a path to a row.
     * @returns {Selection} A Selection class instance.
     */
    Select (FnOrPath = () => true) {
        if (!this._Ready) return null;

        const Entries = typeof FnOrPath === "string" ? this.Fetch(FnOrPath) : (() => {
            if (typeof FnOrPath !== "function") return {};
            const Results = {};

            for (const Entry of this.API.prepare(`SELECT Key, Val FROM '${this.Table}';`).all()) {
                const DecodedEntry = JSON.parse(Entry.Val);
                if (FnOrPath(DecodedEntry, Entry.Key)) Results[Entry.Key] = DecodedEntry;
            }

            return Results;
        })();

        const Selection = require("../Utility/Selection");
        return new Selection(Entries, this.Table);
    }


    // ---------------------------------------------------------------- Array methods

    /**
     * Pushes something to an array at the path output.
     * @param {Pathlike} KeyOrPath Specifies which row or nested array to push to.
     * @param {...Any} Values Values to insert and push to this array.
     * @returns {Number} New length of the array.
     */
    Push (KeyOrPath, ...Values) {
        if (!this._Ready)                  return null;
        if (typeof KeyOrPath !== "string") return null;
        if (!(Values instanceof Array))    return null;
        
        const Origin = this.Fetch(KeyOrPath);
        if (!(Origin instanceof Array)) return null;

        Origin.push(...Values);
        this.Set(KeyOrPath, Origin);
        return Origin.length;
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
        return Popped;
    }

    /**
     * Removes a specific element from this endpoint array.
     * @param {Pathlike} KeyOrPath Specifies which row or nested array to remove a value from.
     * @param {Function|Number} FnOrIdx Function or an index that specifies which item to remove.
     * @returns {Number} New length of the array.
     */
    Remove (KeyOrPath, FnOrIdx) {
        if (!this._Ready) return null;
        if (typeof KeyOrPath !== "string") return null;

        const Origin = this.Fetch(KeyOrPath);
        if (!(Origin instanceof Array)) return null;

        if (typeof FnOrIdx === "function") {
            for (const Key in Origin)
            if (FnOrIdx(Origin[Key], Key)) {
                Origin.splice(Key, 1);
                break;
            }
        } else {
            if (typeof FnOrIdx !== "number") return Origin.length;
            Origin.splice(FnOrIdx, 1);
        }

        this.Set(KeyOrPath, Origin);
        return Origin.length;
    }

    /**
     * Removes elements from this endpoint array based on indexes.
     * @param {Pathlike} KeyOrPath Specifies which row or nested array to slice values from.
     * @param {Number} [Start] Beginning of the specified portion of the array.
     * @param {Number} [End] End of the specified portion of the array.
     * @returns {Number} New length of the array.
     */
    Slice (KeyOrPath, Start, End) {
        if (!this._Ready) return null;
        if (typeof KeyOrPath !== "string") return null;

        let Origin = this.Fetch(KeyOrPath);
        if (!(Origin instanceof Array)) return null;
        Origin = Origin.slice(Start, End);

        this.Set(KeyOrPath, Origin);
        return Origin.length;
    }


    // ---------------------------------------------------------------- Utility methods

    /**
     * Inserts an input into a row or nested object if the key or path wasn't found at the endpoint.
     * It can be used as a default schema of the database elements, that gets inserted if there's no entry already.
     * @param {Pathlike} KeyOrPath Context key to see if it exists, either a row or nested property, and optionally insert the new value.
     * @param {Object|Array|Schema|*} Input A value to input if the row or nested property wasn't found in the database.
     * @param {Boolean} [Merge] Whether or not to merge `Input` with this Connection's Schema model as initial values.
     * @returns {Boolean} Whether or not the new value was inserted.
     */
    Ensure (KeyOrPath, Input = {}, Merge = !!this.ValOptions.Schema) {
        if (!this._Ready)                  return null;
        if (typeof KeyOrPath !== "string") return null;
        if (typeof Input === "undefined")  return null;

        const Exists = this.Exists(KeyOrPath);
        if (KeyOrPath.includes(".")) Merge = false;

        if (!Exists) {
            if (Merge && typeof Input === "object")
            Input = this.ValOptions.Schema.Instance(Input);
            this.Set(KeyOrPath, Input);
        }
        
        return !Exists;
    }

    /**
     * Updates a value if the entry exists by fetching it and passing it onto the callback function.
     * @param {Pathlike} KeyOrPath Specifies which row or nested property to fetch.
     * @param {Function} Fn Callback which includes the original value of the fetched row or property.
     * @returns {Object|Array|DataModel} Returns the new row of the updated property.
     */
    Modify (KeyOrPath, Fn) {
        if (!this._Ready)                  return null;
        if (typeof KeyOrPath !== "string") return null;
        if (typeof Fn !== "function")      return null;

        const Origin = this.Fetch(KeyOrPath);
        const Key    = this._Resolve(KeyOrPath)[0];

        if (typeof Origin !== "undefined") {
            const Value = Fn(Origin, Key);
            this.Set(KeyOrPath, Value);
        }

        return Origin ? this.Fetch(Key) : undefined;
    }

    /**
     * Inverts a boolean, from true to false and vice-versa, at the endpoint of the path.
     * @param {Pathlike} KeyOrPath Specifies which row or nested property to boolean-invert.
     * @returns {Boolean} Returns the updated boolean value of the property.
     */
    Invert (KeyOrPath) {
        if (!this._Ready) return null;
        if (typeof KeyOrPath !== "string") return null;

        const Origin = this.Fetch(KeyOrPath);
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
 * @param {Boolean} UtilCache Whether or not to cache entries while performing utility tasks, such as the Exists method.

 * @param {Number} CacheMaxSize Amount to be considered the maximum size. If this threshold is hit, the cache will temporarily stop adding new entries.
 * @param {Number} SweepInterval Integer to indicate at what interval to sweep the entries of this Connection's internal cache.
 * @param {Number} SweepLifetime The minimum age of an entry in the cache to consider being sweepable after an interval.
 */

/**
 * An entry which has been resolved from the Connection's internal cache.
 * @typedef {Object|Array} DataModel
 * @param {Number} _Timestamp Timestamp when this entry was last patched.
 */

/**
 * Path string to navigate files.
 * @typedef {String} Pathlike
 */
