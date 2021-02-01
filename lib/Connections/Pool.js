
"use strict";

const FS     = require("fs");
const Qulity = require("qulity");

class Pool {

    /**
     * A utility class for managing multiple database Connections.
     * @param {Pathlike} PathURL Path to the database file or directory for this Pool to operate.
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
         * @name Pool#Store
         * @type {DataStore}
         * @link https://github.com/QSmally/Qulity/blob/master/Documentation/DataStore.md
         * @readonly
         */
        Object.defineProperty(this, "Store", {
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
            value: {
                Exclusives: {},
                Binding: true,

                WAL:       true,
                Cache:     true,
                UtilCache: true,

                CacheMaxSize:  false,
                SweepInterval: 300000,
                SweepLifetime: 150000,

                ...PoolOptions
            }
        });

        const Iterator = require("./Pool/Iterator");
        if (FS.existsSync(PathURL)) Iterator(this);

    }


    /**
     * Retrieves a database Connection from this Pool instance.
     * @param {String} Base Reference link to the Connection to resolve.
     * @returns {Connection}
     */
    Select (Base) {
        if (typeof Base !== "string") return null;
        return this.Store.resolve(Base);
    }

    /**
     * Disconnects from all the Connections in this Pool.
     * @returns {Pool}
     */
    Disconnect () {
        this.Store.filter(Connection => {
            Connection.Disconnect();
            return false;
        });

        return this;
    }

}

module.exports = Pool;


/**
 * Options for a database Pool.
 * All integer related options are in milliseconds.
 * @typedef {Object} PoolOptions

 * @param {Object<Identifier, RawOptions>} Exclusives Non-default options to use for certain Connections to a database.
 * @param {Boolean} Binding Whether or not to automatically bind Schemas with the table names in the Pool.

 * @param {Boolean} WAL Default setting to enable Write Ahead Logging mode for Connections in this Pool.
 * @param {Boolean} Cache Whether to enable in-memory caching of entries in results that the next retrieval would be much faster.
 * @param {Boolean} UtilCache Whether or not to cache entries while performing utility tasks, such as the Exists method.

 * @param {Number} CacheMaxSize Amount to be considered the maximum size. If this threshold is hit, the cache will temporarily stop adding new entries.
 * @param {Number} SweepInterval Integer to indicate at what interval to sweep the entries of the Connection's internal cache.
 * @param {Number} SweepLifetime The minimum age of an entry in the cache to consider being sweepable after an interval.
 */
