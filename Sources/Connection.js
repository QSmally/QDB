
"use strict";

const SQL = require("better-sqlite3");

class Connection {

    /**
     * Path string to navigate files.
     * @typedef {String} Pathlike
     */

    /**
     * A set of options for a QDB Connection instance.
     * @typedef {Object} QDBConfiguration
     * @property {String} [table] A name for the table to use at the path for this Connection.
     * @property {Boolean} [WAL] Whether or not to enable Write Ahead Logging mode.
     * @property {Number} [diskCacheSize] The maximum amount of pages on disk SQLite will hold.
     */

    /**
     * An entry which has been fetched from the Connection's internal cache.
     * @typedef {Object|Array} DataModel
     * @property {Number} _timestamp Timestamp when this entry was last resolved or patched.
     */

    /**
     * The main interface for interacting with QDB.
     * @param {Pathlike} pathURL Path to the database file of this Connection.
     * @param {QDBConfiguration} [configuration] Options for this Connection.
     * @example const users = new QDB.Connection("/opt/company/Cellar/Users.qdb");
     */
    constructor(pathURL, configuration = {}) {
        /**
         * Path string to the database.
         * @name Connection#path
         * @type {Pathlike}
         * @readonly
         */
        this.path = pathURL;

        /**
         * The options of this database Connection merged with defaults.
         * @name Connection#configuration
         * @type {QDBConfiguration}
         * @readonly
         */
        this.configuration = {
            table: "QDB",
            WAL: true,
            diskCacheSize: this.constructor.diskCacheSize,

            ...configuration
        };

        /**
         * Table name of this Connection.
         * @name Connection#table
         * @type {String}
         * @readonly
         */
        this.table = this.configuration.table;

        /**
         * Raw SQL property.
         * @name Connection#API
         * @type {SQL}
         * @link https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md
         * @private
         */
        this.API = new SQL(pathURL);

        if (!this.API) {
            throw new Error("A QDB Connection could not be created.");
        } else {
            this.API
                .prepare(`CREATE TABLE IF NOT EXISTS ? ('Key' VARCHAR PRIMARY KEY, 'Val' TEXT);`)
                .run(this.table);
            this.API.pragma(`journal_mode = ${this.journalConfiguration};`);
            this.API.pragma(`cache_size = ${this.configuration.diskCacheSize};`);
            // TODO: implement a synchronisation config property with enumeration.
            this.API.pragma("synchronous = 1");
        }
    }

    /**
     * A journal mode this Connection implements.
     * @name Connection#journalConfiguration
     * @type {String}
     * @private
     */
    get journalConfiguration() {
        // TODO: create type enumeration for this property.
        return this.configuration.WAL ?
            "wal" :
            "delete";
    }
}

module.exports = Connection;
