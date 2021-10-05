
"use strict";

const { Collection } = require("qulity");
const SQL            = require("better-sqlite3");

const Journal         = require("./Enumerations/Journal");
const Synchronisation = require("./Enumerations/Synchronisation");

class Connection {

    /**
     * A set of options for a QDB Connection instance.
     * @typedef {Object} QDBConfiguration
     * @property {String} [table] A name for the table to use at the path for this Connection.
     * @property {Journal} [journal] The journal mode of this database, which defaults to Write Ahead Logging. See https://sqlite.org/pragma.html#pragma_journal_mode.
     * @property {Number} [diskCacheSize] The maximum amount of pages on disk SQLite will hold. See https://sqlite.org/pragma.html#pragma_cache_size.
     * @property {Synchronisation} [synchronisation] SQLite synchronisation, which defaults to 'normal'. See https://sqlite.org/pragma.html#pragma_synchronous.
     */

    /**
     * Path string to navigate data models.
     * @typedef {String} Pathlike
     */

    /**
     * An entry which has been fetched from the Connection's internal cache.
     * @typedef {Object|Array} DataModel
     * @property {Number} _timestamp Timestamp when this entry was last resolved or patched.
     */

    /**
     * The main interface for interacting with QDB.
     * @param {String} pathURL Path to the database file of this Connection.
     * @param {QDBConfiguration} [configuration] Options for this Connection.
     * @example const users = new QDB.Connection("/opt/company/Cellar/Users.qdb");
     */
    constructor(pathURL, configuration = {}) {
        /**
         * Path string to the database.
         * @name Connection#path
         * @type {String}
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
            journal: Journal.writeAhead,
            diskCacheSize: 64e3,
            synchronisation: Synchronisation.full,

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

        /**
         * In-memory cached rows.
         * @name Connection#memory
         * @type {Collection<String, DataModel>}
         * @private
         */
        this.memory = new Collection();

        if (!this.API) {
            throw new Error("A QDB Connection could not be created.");
        } else {
            this.API
                .prepare(`CREATE TABLE IF NOT EXISTS ? ('Key' VARCHAR PRIMARY KEY, 'Val' TEXT);`)
                .run(this.table);
            this.API.pragma(`journal_mode = ${this.configuration.journal};`);
            this.API.pragma(`cache_size = ${this.configuration.diskCacheSize};`);
            this.API.pragma(`synchronous = ${this.configuration.synchronisation};`);
        }
    }

    /**
     * Retrieves the amount of rows in this database table.
     * @name Connection#size
     * @type {Number}
     * @readonly
     */
    get size() {
        return this.API
            .prepare(`SELECT COUNT(*) FROM ?;`)
            .get(this.table)["COUNT(*)"];
    }

    /**
     * Retrieves the amount of the cached data models of this Connection.
     * @name Connection#cacheSize
     * @type {Number}
     * @readonly
     */
    get cacheSize() {
        return this.memory.size;
    }

    /**
     * Retrieves all the keys of this database table.
     * @name Connection#indexes
     * @type {Array<String>}
     * @readonly
     */
    get indexes() {
        return this.API
            .prepare(`SELECT Key FROM ?;`)
            .all(this.table)
            .map(row => row["Key"]);
    }

    // Private methods

    /**
     * Internal method.
     * Resolves a dot-separated path to a key and rest path.
     * @param {Pathlike} pathlike String input to be formed and parsed.
     * @returns {Array}
     * @private
     */
    _resolveKeyPath(pathlike) {
        const path = pathlike.split(/\.+/g);
        return [path[0], path.slice(1)];
    }

    /**
     * Internal method.
     * Finds a relative dot-separated pathway of a data model.
     * @param {DataModel} dataObject The object-like target.
     * @param {Array<String>} path A parsed array of a pathlike notation from '_resolveKeyPath'.
     * @param {*} [item] A value to place into the pathway endpoint.
     * @returns {*}
     * @private
     */
    _pathCast(dataObject, path, item) {
        const originalDataObject = dataObject;
        const finalKey = pathlike.pop();

        for (const key of path) {
            if (typeof dataObject !== "object") return;
            if (!dataObject.hasOwnProperty(key) && item === undefined) return;
            if (!dataObject.hasOwnProperty(key)) dataObject[key] = {};

            dataObject = dataObject[key];
        }

        if (dataObject) {
            if (item === undefined) return dataObject[finalKey];
            dataObject[finalKey] = item;
            return originalDataObject;
        }
    }

    // Integrations
    // ... iterator, transaction

    // Standard methods
    // ... set, fetch, evict, erase

    // Search methods
    // ... exists, each, find, select

    // Array methods
    // ... push, shift, pop, remove, slice

    // Utility methods
    // ... ensure, modify, insert
}

module.exports = Connection;
