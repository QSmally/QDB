
"use strict";

const BaseConnection = require("./BaseConnection");

const FS     = require("fs");
const Qulity = require("qulity");
const SQL    = require("better-sqlite3");
const { runInThisContext } = require("vm");

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
                    Backups:       typeof rawOptions.Backups == "undefined"       ? false : rawOptions.Backups,
                    Table:         typeof rawOptions.Table == "undefined"         ? "QDB" : rawOptions.Table
                }
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
            this.API.exec(`CREATE TABLE IF NOT EXISTS '${this.ValOptions.Table}' ('Key' varchar PRIMARY KEY, 'Val' text)`);
        }

    }


    /**
     * Fetches all the rows of this database.
     * @returns {Number}
     */
    get Size () {
        if (this.State !== "CONNECTED") return undefined;
        return this.API.prepare("SELECT count(*) FROM QDB").get()["count(*)"];
    }

    /**
     * Retrieves all the in-memory cached rows of this Connection.
     * @returns {Number}
     */
    get CacheSize () {
        if (this.State !== "CONNECTED") return undefined;
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
     * Resolves a dotaccess path or key.
     * @param {String} Pathlike 
     * @returns {String|Array} String if it's just a key, or an array as dotaccess notation.
     */
    _ResolvePath (Pathlike) {
        const Path = Pathlike.split(/\.+/g);
        if (Path.length == 1) return Path[0];
        else return Path;
    }

    /**
     * Finds a relative dotaccess pathway.
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
     * @param {*} Value Data to set into the row, at the location of the key or path.
     * @returns {Connection} Returns the updated database.
     */
    Set (KeyOrPath, Value) {

    }

    /**
     * Manages the retrieval of the database.
     * @param {*} KeyOrPath Specifies at what row to fetch. Use dotaccess notation to edit in-depth values.
     * @returns {*} Value of the row, or the property when using dotaccess.
     */
    Fetch (KeyOrPath) {

    }

}

module.exports = Connection;
