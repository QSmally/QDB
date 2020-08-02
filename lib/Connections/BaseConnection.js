
"use strict";

class BaseConnection {

    /**
     * Base class of the Connection.
     * @param {RawOptions} RawOptions Options to validate.
     */
    constructor (RawOptions) {

        /**
         * Path string to the database.
         * @name BaseConnection#Path
         * @type {Pathlike}
         * @readonly
         */
        Object.defineProperty(this, "Path", {
            enumerable: true,
            writable: true,
            value: null
        });

        /**
         * Current state of this Connection.
         * @name BaseConnection#State
         * @type {String}
         * @readonly
         */
        Object.defineProperty(this, "State", {
            enumerable: true,
            writable: true,
            value: "CONNECTED"
        });

    }

}

module.exports = BaseConnection;


const RawOptionsDefault = {
    Table:  "QDB",     // Table name to use for this database
    Schema: undefined, // A schema to keep track of for automatic migration
    WAL:    true,      // Whether to enable Write Ahead Logging

    Cache: {
        Enabled:   true,     // Whether to enable the cache
        SweepInt:  86400000, // Sweep interval of the cache
        SweepLife: 5400000,  // Minimum lifetime of the entry to be swept
        FetchAll:  false,    // Whether to fetch all database entries on start
    },

    Backups: {
        Enabled:   false,     // Whether to enable database backups
        Interval:  18000000,  // Interval for the backups to occur
        Directory: "Backups/" // Directory of the database backups
    }
}
