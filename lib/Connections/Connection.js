
"use strict";

const PartialConnection = require("./PartialConnection.js");

const FS     = require("fs");
const Qulity = require("qulity");
const SQL    = require("better-sqlite3");

class Connection extends PartialConnection {

    /**
     * The main interface for interacting with QDB.
     * @param {Pathlike} PathURL Path to the database file.
     * @param {RawOptions} [RawOptions] Options for this Connection.
     * @param {Pool} [Pool] Pool reference when this database was initialised in a Pool.
     * @example const Users = new QDB.Connection("lib/Databases/Users.qdb");
     * @extends {BaseConnection}
     */
    constructor (PathURL, RawOptions = {}, Pool = undefined) {

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

                    Cache: true,
                    FetchAll: false,
                    SweepInterval: 3600000,
                    SweepLifetime: 10800000,

                    Backups: false,
                    BackupInterval: 21600000,
                    BackupLifetime: 5,
                    BackupDirectory: "Databases/Backups/"
                }, RawOptions)
            });

            /**
             * Whether this Connection is used in a Pool.
             * @name Connection#Pool
             * @type {Pool|null}
             */
            Object.defineProperty(this, "Pool", {
                enumerable: true,
                value: Pool || null
            });

            /**
             * Table name of this Connection.
             * @name Connection#Table
             * @type {String}
             * @readonly
             */
            Object.defineProperty(this, "Table", {
                value: this.ValOptions.Table || "QDB"
            });

            /**
             * Raw SQL property.
             * @name Connection#API
             * @type {SQL}
             * @private
             * @readonly
             */
            Object.defineProperty(this, "API", {
                value: new SQL(PathURL)
            });

            /**
             * In-memory cached rows.
             * @name Connection#Cache
             * @type {DataStore}
             * @private
             * @readonly
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
         * I.e. schema, sweep intervals, backups, fetch all.
         * @name Connection#_Executors
         * @type {Object}
         * @private
         */
        const Executors = require("../Executors/_Index");
        Object.defineProperty(this, "_Executors", {value: {}});
        for (const Method in Executors) if (this.ValOptions[Method])
        this._Executors[Method] = Executors[Method](this);

        /**
         * Event transmitter of this database.
         * Internally used and for API's (i.e. Pools).
         * @name Connection#_EventHandler
         * @type {Events}
         * @private
         */
        const EventEmitter = require("events");
        Object.defineProperty(this, "_EventHandler", {
            value: new EventEmitter()
        });

    }


    /**
     * Fetches asll the rows of this database.
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
     * @returns {Array} Returns a list of indexes.
     */
    get Indexes () {
        if (!this._Ready) return [];
        return this.API.prepare(`SELECT Key FROM '${this.Table}';`)
        .all().map(Row => Row.Key);
    }

    /**
     * 
     * @param {String} Event String to represent which event you're applying to the function.
     * @param {Function} Fn Function to execute when this event triggers.
     * @returns {Boolean} Whether this event was registered.
     */
    On (Event, Fn) {
        if (typeof Fn !== "function")  return false;
        if (typeof Event !== "string") return false;
        if (!["Set", "Fetch", "Erase"].includes(Event)) return false;

        this._EventHandler.on(Event, Fn);
        return true;
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
     * @param {Array} Pathlike A dotaccess notation path as an Array. Preferred `Path` from {@link _Resolve}.
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
     * Converts this database's rows into an Object. To use dotaccess, use {@link Fetch} instead.
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
     */
    ToIntegratedManager (Pathlike = null, Holds = null) {
        if (!this._Ready) return null;

        const [Key, Path] = Pathlike ? this._Resolve(Pathlike.toString()) : [];
        const Iterable = typeof Key !== "undefined" ? this.Fetch([Key, ...Path].join(".")) :
        this.API.prepare(`SELECT * FROM '${this.Table}';`).all().map(Row => [Row.Key, JSON.parse(Row.Val)]);

        return new Qulity.Manager(Iterable, Holds);
    }


    // ---------------------------------------------------------------- Database methods

    /**
     * Manages the elements of the database.
     * @param {Pathlike} KeyOrPath Specifies at what row to insert or replace the element at. Use dotaccess notation to edit properties.
     * @param {Object|Array|*} Value Data to set at the row address, at the location of the key or path.
     * @returns {Connection} Returns the updated database.
     */
    Set (KeyOrPath, Value) {
        if (!this._Ready) return this;
        if (typeof Value === "object") delete Value._DataStore;
        const [Key, Path] = this._Resolve(KeyOrPath.toString());

        if (typeof Path !== "undefined") Value = this._CastPath(this.Fetch(Key) || {}, Path, {Item: Value});
        else if (typeof Value !== "object") return this;
        
        if (this.Cache.has(Key)) this._Patch(Key, Value);
        this.API.prepare(`INSERT OR REPLACE INTO '${this.Table}' ('Key', 'Val') VALUES (?, ?);`)
        .run(Key, JSON.stringify(Value));

        this._EventHandler.emit("Set", {KeyOrPath, Key, Path}, Value);

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
        const [Key, Path] = this._Resolve(KeyOrPath.toString());

        let Fetched = this.Cache.resolve(Key) || (() => {
            const Req = this.API.prepare(`SELECT Val FROM '${this.Table}' WHERE Key = ?;`).get(Key);
            if (typeof Req !== "undefined") return JSON.parse(Req.Val);
            else return Req;
        })();

        if (Fetched === null || Fetched === undefined) return Fetched;
        if (Cache && !this.Cache.has(Key)) this._Patch(Key, Fetched);

        Fetched = Fetched instanceof Array ? [...Fetched] : {...Fetched};
        if (typeof Path !== "undefined") Fecthed = this._CastPath(Fetched, Path);
        if (typeof Fetched === "object") delete Fetched._Timestamp;

        this._EventHandler.emit("Fetch", {KeyOrPath, Key, Path}, Fetched, Cache);

        return Fetched;
    }

    /**
     * Erases elements from this Connection's internal cache.
     * @param  {...Pathlike} [Keys] A key or multiple keys to remove from cache. If none, the cache will get cleared entirely.
     * @returns {Connection} Returns the updated database.
     */
    Evict (...Keys) {
        if (!this._Ready) return this;
        if (!(Keys instanceof Array)) return null;

        if (!Keys.length) this.Cache.clear();
        else for (const Key of Keys) this.Cache.delete(Key);
        return this;
    }

    /**
     * Manages the deletion of the database.
     * @param  {...Pathlike} Keys A key or multiple keys to remove from the database.
     * These elements will also get removed from this Connection's internal cache.
     * @returns {Connection} Returns the updated database.
     */
    Erase (...Keys) {
        if (this._Ready && Keys.length) {
            for (const Key of Keys)
            this.API.prepare(`DELETE FROM '${this.Table}' WHERE Key = ?;`).run(Key);
            this._EventHandler.emit("Erase", Keys);
            this.Evict(...Keys);
        }

        return this;
    }

}

module.exports = Connection;


/**
 * Options for a database Connection.
 * All integer related options are in milliseconds.
 * @typedef {Object} RawOptions

 * @param {String} Table A name for the table to use at this path.
 * @param {Schema} Schema Link to a database Schema class for automatic migration.
 * @param {Boolean} WAL Whether or not to enable Write Ahead Logging mode.

 * @param {Boolean} Cache Whether to enable in-memory caching of entries in results that the next retrieval would be much faster.
 * @param {Boolean} FetchAll Whether or not to fetch all the database entries on start-up of this Connection.
 * @param {Number} SweepInterval Integer to indicate at what interval to sweep the entries of this Connection's internal cache.
 * @param {Number} SweepLifetime The minimum age of an entry in the cache to consider being sweepable after an interval.

 * @param {Boolean} Backups Whether to enable database backups for this Connection's database.
 * @param {Number} BackupInterval Integer to indicate at what interval to create a low-level backup.
 * @param {Number} BackupLifetime After how many intervals to merge the latest low-level into one.
 * @param {Pathlike} BackupDirectory A path URL to the directory to place all the backups in.
 */
