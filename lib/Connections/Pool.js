
"use strict";

const FS     = require("fs");
const Qulity = require("qulity");

class Pool {

    /**
     * A utility class for managing multiple database Connections.
     * @param {Pathlike} pathURL Path to the database file or directory for this Pool to operate.
     * @param {PoolOptions} [poolOptions] Options for this Pool to manage, including separate Connection options.
     * @example const myDBs = new QDB.Pool("/usr/Production/Cellar/");
     */
    constructor (pathURL, poolOptions = {}) {
        /**
         * Path string to the Pool directory.
         * @name Pool#path
         * @type {Pathlike}
         * @readonly
         */
        Object.defineProperty(this, "path", {
            enumerable: true,
            value: pathURL
        });

        /**
         * A collection of databases this Pool holds.
         * @name Pool#store
         * @type {Collection}
         * @link https://github.com/QSmally/Qulity/blob/master/Documentation/Collection.md
         * @readonly
         */
        Object.defineProperty(this, "store", {
            enumerable: true,
            value: new Qulity.Collection()
        });

        /**
         * Options for this Pool.
         * @name Pool#valOptions
         * @type {PoolOptions}
         * @readonly
         */
        Object.defineProperty(this, "valOptions", {
            value: {
                exclusives: {},
                binding: true,

                WAL:       true,
                cache:     true,
                utilCache: true,

                cacheMaxSize:  false,
                sweepInterval: 300000,
                sweepLifetime: 150000,

                ...poolOptions
            }
        });

        const iterator = require("./Pool/Iterator");
        if (FS.existsSync(pathURL)) iterator(this);
    }


    /**
     * Retrieves a database Connection from this Pool instance.
     * @param {String} base Reference link to the Connection to resolve.
     * @returns {Connection}
     */
    select (base) {
        return typeof base === "string" ?
            this.store.get(base) :
            null;
    }

    /**
     * Disconnects from all the Connections in this Pool.
     * @returns {Pool}
     */
    disconnect () {
        this.store
            .each(connection => connection.disconnect())
            .clear();
        return this;
    }
}

module.exports = Pool;


/**
 * Options for a database Pool.
 * All integer related options are in milliseconds.
 * @typedef {Object} PoolOptions

 * @param {Object<Identifier, RawOptions>} exclusives Non-default options to use for certain Connections to a database.
 * @param {Boolean} binding Whether or not to automatically bind Schemas with the table names in the Pool.

 * @param {Boolean} WAL Default setting to enable Write Ahead Logging mode for Connections in this Pool.
 * @param {Boolean} cache Whether to enable in-memory caching of entries in results that the next retrieval would be much faster.
 * @param {Boolean} utilCache Whether or not to cache entries while performing utility tasks, such as the Exists method.

 * @param {Number} cacheMaxSize Amount to be considered the maximum size. If this threshold is hit, the cache will temporarily stop adding new entries.
 * @param {Number} sweepInterval Integer to indicate at what interval to sweep the entries of the Connection's internal cache.
 * @param {Number} sweepLifetime The minimum age of an entry in the cache to consider being sweepable after an interval.
 */
