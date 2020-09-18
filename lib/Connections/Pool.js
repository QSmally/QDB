
"use strict";

const FS     = require("fs");
const Qulity = require("qulity");

class Pool {

    /**
     * A utility class for managing multiple database Connections.
     * @param {Pathlike} PathURL Path to the database file or directory.
     * @param {PoolOptions} [PoolOptions] Options for this Pool to manage, including separate Connection options.
     * @example const MyDBs = new QDB.Pool("lib/Databases/");
     */
    constructor (PathURL, PoolOptions = {}) {

        /**
         * Path string to the Pool directory.
         * @name Pool#Path
         * @type {Pathlike}
         * @readonly
         */
        Object.defineProperty(this, "Path", {
            enumerable: true,
            value: PathURL
        });

        /**
         * A collection of databases this Pool holds.
         * @name Pool#Databases
         * @type {DataStore}
         * @link https://github.com/QSmally/Qulity/blob/master/Documentation/DataStore.md
         * @readonly
         */
        Object.defineProperty(this, "Databases", {
            enumerable: true,
            value: new Qulity.DataStore()
        });

        /**
         * Options for this Pool.
         * @name Pool#ValOptions
         * @type {PoolOptions}
         * @readonly
         */
        Object.defineProperty(this, "ValOptions", {
            value: Object.assign({
                Exclusives: {},
                Threads:    false,

                Table:     "QDB",
                WAL:       true,
                Cache:     true,
                UtilCache: true,
                IterCache: false,
                SweepInterval: 3600000,
                SweepLifetime: 10800000,

                BackupInterval:  21600000,
                BackupDirectory: "Databases/Backups/"
            }, PoolOptions)
        });


        const Iterator = require("../Executors/Pool/Iterator");
        if (FS.existsSync(PathURL)) Iterator(this);

        /**
         * The manager that handles backups of this Pool.
         * @name Pool#_BackupManager
         * @type {Function?}
         * @private
         */
        const BackupManager = require("../Executors/Pool/BackupManager");
        Object.defineProperty(this, "_BackupManager", {
            value: BackupManager(this)
        });

    }


    /**
     * Retrieves a database Connection (or a
     * ThreadProvider if this Pool is multithreaded).
     * @param {String} Base Reference link to the Connection to resolve.
     * @returns {Connection|ThreadProvider}
     */
    $ (Base) {
        if (typeof Base !== "string") return null;
        return this.Databases.resolve(Base);
    }

    /**
     * Disconnects from all the Connections in this Pool.
     * @returns {Pool}
     */
    Disconnect () {
        this.Databases.filter(Connection => {
            Connection.Disconnect();
            return false;
        });

        clearInterval(this._BackupManager);

        return this;
    }

}

module.exports = Pool;


/**
 * Options for a database Pool.
 * All integer related options are in milliseconds.
 * @typedef {Object} PoolOptions

 * @param {Object<Filename, RawOptions>} Exclusives Non-default options to use for certain Connections to a database.
 * @param {Boolean|Number} Threads Whether to create a thread for each Connection, or an integer to indicate the amount of threads.

 * @param {String} Table A default table name for each Connection in this Pool.
 * @param {Boolean} WAL Default setting to enable Write Ahead Logging mode for Connections in this Pool.
 * @param {Boolean} Cache Whether to enable in-memory caching of entries in results that the next retrieval would be much faster.
 * @param {Boolean} UtilCache Whether or not to cache entries while performing utility tasks, such as the Exists and Accumulate methods.
 * @param {Boolean} IterCache Whether to cache iterating entries while performing utility tasks, like the Each and Select methods.
 * @param {Number} SweepInterval Integer to indicate at what interval to sweep the entries of the Connection's internal cache.
 * @param {Number} SweepLifetime The minimum age of an entry in the cache to consider being sweepable after an interval.

 * @param {Number} BackupInterval Integer to indicate at what interval to create a snapshot backup, or merge the snapshots.
 * @param {Pathlike} BackupDirectory A path URL to the directory to insert all the database backups in.
 */
