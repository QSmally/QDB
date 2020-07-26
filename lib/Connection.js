
"use strict";

const BaseConnection = require("./BaseConnection");

const FS     = require("fs");
const Qulity = require("qulity");
const SQL    = require("better-sqlite3");

class Connection extends BaseConnection {

    /**
     * The main interface for interacting with QDB.
     * @param {Pathlike} PathURL Path to the database file.
     * @param {Object} [rawOptions] Options for this Connection.
     * @param {Pool} [Pool] Pool reference when this database was initialised in a Pool.
     * @example const MyDB = new QDB.Connection("lib/Databases/Users.qdb");
     * @extends {BaseConnection}
     */
    constructor (PathURL, rawOptions = {}, Pool = undefined) {

        if (FS.existsSync(PathURL)) {

            super();

            this.Path  = PathURL;
            this.State = "CONNECTED";

            /**
             * Whether this Connection is used in a pool.
             * @name Connection#Pool
             * @type {Pool|null}
             */
            this.Pool = Pool || null;

            /**
             * Validated options for this Connection.
             * @name Connection#ValOptions
             * @type {Object}
             * @readonly
             */
            Object.defineProperty(this, "ValOptions", {
                value: {
                    FetchAll:      typeof rawOptions.FetchAll == "undefined"      ? false : (rawOptions.Backups ? true : false),
                    SweepInterval: typeof rawOptions.SweepInterval == "undefined" ? 86400000 : parseInt(rawOptions.SweepInterval),
                    Backups:       typeof rawOptions.Backups == "undefined"       ? false : rawOptions.Backups.toString(),
                    Cache:         typeof rawOptions.Cache == "undefined"         ? true : (rawOptions.Cache ? true : false)
                }
            });

            /**
             * Table name for this Connection.
             * @name Connection#Table
             * @type {String}
             * @readonly
             */
            Object.defineProperty(this, "Table", {
                value: typeof rawOptions.Table == "undefined" ? "QDB" : rawOptions.Table.toString()
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
             * In-memory cached tables.
             * @name Connection#Cache
             * @type {DataStore}
             * @private
             * @readonly
             */
            Object.defineProperty(this, "Cache", {
                value: new Qulity.DataStore()
            });

        } else {
            const PartialConnection = require("./PartialConnection");
            return new PartialConnection();
        }

        if (!this.API || this.Path.split(".").pop() !== "qdb") {
            const PartialConnection = require("./PartialConnection");
            return new PartialConnection();
        } else {
            this.API.exec(`CREATE TABLE IF NOT EXISTS '${this.Table}' ('Key' varchar PRIMARY KEY, 'Val' text);`);
        }


        // TODO: add fetchAll support, cache sweep and backups

    }


    /**
     * Fetches all the rows of this database.
     * @returns {Number}
     */
    get Size () {
        if (!this._Ready) return null;
        return this.API.prepare(`SELECT count(*) FROM '${this.Table}';`).get()["count(*)"];
    }

    /**
     * Retrieves all the in-memory cached rows of this Connection.
     * @returns {Number}
     */
    get CacheSize () {
        if (!this._Ready) return 0;
        return this.Cache.size;
    }

    /**
     * Disconnects from the database, clears in-memory rows.
     * @returns {PartialConnection}
     */
    Disconnect () {
        const PartialConnection = require("./PartialConnection");
        this.API.close();
        this.State = "DISCONNECTED";
        return new PartialConnection();
    }


    // -------------------------------------------------------------------- Integration

    /**
     * Converts this database to an Object. To use dotaccess, use `Fetch` instead.
     * @returns {Object} An Object instance with the key/value pairs.
     */
    AsObject () {
        if (!this._Ready) return null;
        return Object.fromEntries(this.API.prepare(`SELECT * FROM '${this.Table}';`)
        .all().map(Row => [Row.Key, JSON.parse(Row.Val)]));
    }

    /**
     * Converts this database, or a part of it using dotaccess, to any Map-form instance.
     * @param {Function} Instance Instance to be converted to. Should either be an instance of a Map or Set,
     * and this can include extended classes like Collections and DataStores.
     * @param {String} [Pathlike] Optional dotaccess path pointing towards what to serialise.
     * @param  {...Any} [Args] Additional arguments to pass on to the instance.
     * @returns {*} The instance with the target as entries.
     */
    ToInstance (Instance, Pathlike = null, ...Args) {
        if (!this._Ready) return null;
        if (typeof Instance == "undefined") return null;

        const [Key, Path] = Pathlike ? this._ResolvePath(Pathlike.toString()) : [];
        const Iterable = typeof Key !== "undefined" ? this.Fetch([Key, ...Path].join(".")) :
        this.API.prepare(`SELECT * FROM '${this.Table}';`).all().map(Row => [Row.Key, JSON.parse(Row.Val)]);

        return new Instance(Iterable, ...Args);
    }

    /**
     * Converts this database, or a part of it using dotaccess, to a DataStore instance.
     * @param {String} [Pathlike] Optional dotaccess path pointing towards what to serialise.
     * @returns {DataStore} A DataStore instance with the key/model pairs.
     */
    ToDataStore (Pathlike = null) {
        return this.ToInstance(Qulity.DataStore, Pathlike);
    }

    /**
     * Converts this database, or a part of it using dotaccess, to a Manager instance.
     * @param {String} [Pathlike] Optional dotaccess path pointing towards what to serialise.
     * @param {Function} [Holds] Given optional class for which instance this Manager is for.
     * @returns {Manager} A Manager instance with the key/model pairs.
     */
    ToIntegratedManager (Pathlike = null, Holds = null) {
        return this.ToInstance(Qulity.Manager, Pathlike, Holds);
    }


    // -------------------------------------------------------------------- Private methods

    /**
     * Internal method. Check whether this database is ready for execution.
     * @private
     */
    get _Ready () {
        if (this.State !== "CONNECTED") return false;
        if (!this.API.open) return false;
        return true;
    }

    /**
     * Internal method. Resolves a dotaccess path or key.
     * @param {String} Pathlike Input string to be formed and parsed.
     * @returns {Array<String, Array|undefined>} Array containing a `Key`, and optionally `Path`.
     * @private
     */
    _ResolvePath (Pathlike) {
        const Path = Pathlike.split(/\.+/g);
        return [Path[0], Path.length > 1 ? Path.slice(1) : undefined];
    }

    /**
     * Internal method. Finds a relative dotaccess pathway.
     * @param {Object|Array} Frame The object-like beginning to cast.
     * @param {Array} Pathlike A dotaccess notation path as an Array. Prefered `Path` from {@link _ResolvePath}.
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


    // -------------------------------------------------------------------- Database methods

    /**
     * Manages the elements of the database.
     * @param {String} KeyOrPath Specifies at what row to insert or replace the element at. Use dotaccess notation to edit in-depth values.
     * @param {Object|Array|*} Value Data to set into the row, at the location of the key or path.
     * @returns {Connection} Returns the updated database.
     */
    Set (KeyOrPath, Value) {
        if (!this._Ready) return null;
        if (typeof Value === "object") delete Value._DataStore;
        const [Key, Path] = this._ResolvePath(KeyOrPath.toString());

        if (typeof Path !== "undefined") Value = this._CastPath(this.Fetch(Key) || {}, Path, {Item: Value});
        else if (typeof Value !== "object") return null;

        if (this.Cache.has(Key)) this.Cache.set(Key, Value instanceof Array ? [...Value] : {...Value});
        this.API.prepare(`INSERT OR REPLACE INTO '${this.Table}' ('Key', 'Val') VALUES (?, ?);`)
        .run(Key, JSON.stringify(Value));

        return this;
    }

    /**
     * Manages the retrieval of the database.
     * @param {String} KeyOrPath Specifies which row to fetch or get from cache. Use dotaccess notation to retrieve in-depth values.
     * @param {Boolean} [Cache] Whether to, when not already, cache this entry in results that the next retrieval would be much faster.
     * @returns {Object|Array|*} Value of the row, or the property when using dotaccess.
     */
    Fetch (KeyOrPath, Cache = this.ValOptions.Cache) {
        if (!this._Ready) return null;
        const [Key, Path] = this._ResolvePath(KeyOrPath.toString());

        let Fetched = this.Cache.resolve(Key) || (() => {
            const Req = this.API.prepare(`SELECT * FROM '${this.Table}' WHERE Key = ?;`).get(Key);
            if (typeof Req !== "undefined") return JSON.parse(Req.Val);
            else return Req;
        })();

        if (Fetched === null || Fetched === undefined) return Fetched;
        if (!this.Cache.has(Key) && Cache) this.Cache.set(Key, Fetched);

        Fetched = Fetched instanceof Array ? [...Fetched] : {...Fetched};
        if (typeof Path !== "undefined") Fetched = this._CastPath(Fetched, Path);
        if (typeof Fetched === "object") delete Fetched._DataStore;

        return Fetched;
    }

}

module.exports = Connection;
