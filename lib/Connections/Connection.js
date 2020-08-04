
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


        // Database utility options
        // e.g. fetchAll, backups, sweep

    }


    /**
     * Fetches asll the rows of this database.
     * @name Connection#Size
     * @type {Number}
     */
    get Size () {
        if (!this._Ready) return 0;
        return this.API.prepare(`SELECT count(*) FROM '${this.Table}';`).get()["count(*)"];
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
     * Disconnects from this Connection, clears in-memory rows.
     * @returns {Conncetion}
     */
    Disconnect () {
        this.API.close();
        this.Cache.clear();
        this.State = "DISCONNECTED";

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

 * @param {Boolean} Cache Whether to enable in-memory caching of entries to make a second fetch much faster.
 * @param {Boolean} FetchAll Whether to fetch all the database entries on start-up of this Connection.
 * @param {Number} SweepInterval Integer to indicate at what interval to sweep the cache.
 * @param {Number} SweepLifetime The minimum age of an entry cache to consider being sweepable.

 * @param {Boolean} Backups Whether to enable database backups for this Connection's database.
 * @param {Number} BackupInterval Integer to indicate at what interval to create a low-level backup.
 * @param {Number} BackupLifetime After how many intervals to merge the latest low-level into one.
 * @param {Pathlike} BackupDirectory A path URL to the directory to place all the backups in.
 */
