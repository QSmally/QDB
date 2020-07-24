
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
     * Converts this database, or a part of it using dotaccess, to any Map-form instance.
     * @param {*} Instance Instance to be converted to. Should either be an instance of a Map or Set,
     * and this can include extended classes like Collections and DataStores.
     * @param {Dotaccess} [Path] Optional dotaccess path pointing towards what to serialise.
     * @param  {...Any} [Args] Additional arguments to pass on to the instance.
     * @returns {*} The instance with the target as entries.
     */
    ToInstance (Instance, Path = null, ...Args) {
        // TODO: make integration methods, like ToDataStore, ToCollection and ToObject
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
     */
    _ResolvePath (Pathlike) {
        const Path = Pathlike.split(/\.+/g);
        return [Path[0], Path.length > 1 ? Path : undefined];
    }

    /**
     * Internal method. Finds a relative dotaccess pathway.
     * @param {Dotaccess} Pathlike A dotaccess notation path.
     * @param {Object} [Options] Additional queries for the caster to use.
     * @returns {*}
     */
    _CastPath (Pathlike, {
        Item  = undefined,
        Erase = false,
        Push  = false
    }) {
        // if (Item === undefined)
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
        if (typeof Value !== "object") return null;

        const [Key, Path] = this._ResolvePath(KeyOrPath.toString());
        
        if (Path) {
            // TODO: do dotaccess stuff
        }

        if (this.Cache.has(Key)) this.Cache.set(Key, Value);
        this.API.prepare(`INSERT OR REPLACE INTO '${this.Table}' ('Key', 'Val') VALUES (?, ?);`)
        .run(Key, JSON.stringify(Value));

        return this;
    }

    /**
     * Manages the retrieval of the database.
     * @param {String} KeyOrPath Specifies which row to fetch or get from cache. Use dotaccess notation to retrieve in-depth values.
     * @returns {Object|Array|*} Value of the row, or the property when using dotaccess.
     */
    Fetch (KeyOrPath) {
        if (!this._Ready) return null;

        const [Key, Path] = this._ResolvePath(KeyOrPath.toString());

        let Fetched = this.Cache.has(Key) ? this.Cache.resolve(Key) :
        JSON.parse(this.API.prepare(`SELECT * FROM '${this.Table}' WHERE Key = ?;`).get(Key)["Val"]);

        if (typeof Fetched == "undefined") return undefined;
        if (this.Cache.has(Key)) this.Cache.set(
            Key, Fetched instanceof Array ? [...Fetched] : {...Fetched}
        );

        if (Path) {
            // TODO: do dotaccess stuff
            // Change 'Fetched' to new dotaccess retrieved path
        }

        return Fetched;
    }

}

module.exports = Connection;
