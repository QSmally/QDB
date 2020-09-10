
"use strict";

const Connection = require("./Connection");

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
 * @param {Number} SweepInterval Integer to indicate at what interval to sweep the entries of this Connection's internal cache.
 * @param {Number} SweepLifetime The minimum age of an entry in the cache to consider being sweepable after an interval.

 * @param {Number} SnapshotLifetime After how many intervals to merge the latest snapshot backups into one.
 * @param {Number} BackupInterval Integer to indicate at what interval to create a snapshot backup, or merge the snapshots.
 * @param {Pathlike} BackupDirectory A path URL to the directory to insert all the database backups in.
 */
