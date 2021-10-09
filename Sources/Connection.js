
"use strict";

const { Collection } = require("qulity");
const SQL            = require("better-sqlite3");

const Journal         = require("./Enumerations/Journal");
const Synchronisation = require("./Enumerations/Synchronisation");

const { serialize, deserialize } = require("v8");

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
                .prepare(`CREATE TABLE IF NOT EXISTS '${this.table}' ('Key' VARCHAR PRIMARY KEY, 'Val' TEXT);`)
                .run();
            this.API.pragma(`journal_mode = ${this.configuration.journal};`);
            this.API.pragma(`cache_size = ${this.configuration.diskCacheSize};`);
            this.API.pragma(`synchronous = ${this.configuration.synchronisation};`);
        }
    }

    /**
     * Internal method.
     * A shorthand to cloning data models using the serialisation API of v8.
     * @param {DataModel} dataObject A structure to copy.
     * @returns {DataModel}
     * @private
     */
    static clone(dataObject) {
        return deserialize(serialize(dataObject));
    }

    /**
     * Internal method.
     * Returns whether or not an entry conforms to being a data model's root.
     * @param {*} dataObject An entry which can be a data model.
     * @returns {Boolean}
     */
    static isDataModel(dataObject) {
        return dataObject && typeof dataObject === "object";
    }

    // Statistics

    /**
     * Retrieves the amount of rows in this database table.
     * @name Connection#size
     * @type {Number}
     * @readonly
     */
    get size() {
        return this.API
            .prepare(`SELECT COUNT(*) FROM '${this.table}';`)
            .get()["COUNT(*)"];
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
            .prepare(`SELECT Key FROM '${this.table}';`)
            .all()
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
     * @param {Array<String>} pathContext A parsed array of a pathlike notation from '_resolveKeyPath'.
     * @param {*} [item] A value to place into the pathway endpoint.
     * @returns {*}
     * @private
     */
    _pathCast(dataObject, pathContext, item) {
        const originalDataObject = dataObject;
        const finalKey = pathContext.pop();

        for (const key of pathContext) {
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

    /**
     * Internal method.
     * Inserts or patches something in this Connection's internal cache.
     * @param {String} keyContext As address to memory map this data model to.
     * @param {DataModel} document The value to set in the cache, as a parsed memory model.
     * @returns {Collection}
     * @private
     */
    _patch(keyContext, document) {
        // TODO:
        // Implement a cache manager and eviction policies as configurable
        // asset in a Connection's configuration.
        const documentClone = Connection.clone(document);
        documentClone._timestamp = Date.now();

        this.memory.set(keyContext, documentClone);
        return this.memory;
    }

    // Integrations
    // ... iterator, transaction

    // Standard methods
    // ... set, fetch, evict, erase

    /**
     * Manages the elements of the database.
     * @param {Pathlike} pathContext Specifies at which row and nested property to insert or replace the element at.
     * @param {DataModel|*} document Any data to set at the row address, or the location of the key-path.
     * @returns {Connection}
     */
    set(pathContext, document) {
        const [keyContext, path] = this._resolveKeyPath(pathContext);

        if (path.length) {
            const documentOld = this.fetch(keyContext) ?? {};
            document = this._pathCast(documentOld, path, document);
        } else {
            if (!Connection.isDataModel(document))
                throw new TypeError("Type of 'document' must be a data model for the root path.");
        }

        this.API
            .prepare(`INSERT OR REPLACE INTO '${this.table}' ('Key', 'Val') VALUES (?, ?);`)
            .run(keyContext, JSON.stringify(document));
        if (this.memory.has(keyContext)) this._patch(keyContext, document);

        return this;
    }

    /**
     * Manages the retrieval of the database.
     * @param {Pathlike} pathContext Specifies which row and nested property to fetch or get from the cache.
     * @returns {*}
     */
    fetch(pathContext) {
        // TODO:
        // Implement manual cache toggle whenever the other cache management
        // things are also implemented.
        const [keyContext, path] = this._resolveKeyPath(pathContext);

        const fetched = this.memory.get(keyContext) ?? (() => {
            const { Val: document } = this.API
                .prepare(`SELECT Val FROM '${this.table}' WHERE Key = ?;`)
                .get(keyContext) ?? {};
            return document === undefined ?
                document :
                JSON.parse(document);
        })();

        if (fetched == undefined) return fetched;
        if (!this.memory.has(keyContext)) this._patch(keyContext, fetched);

        let documentClone = Connection.clone(fetched);
        if (path !== undefined) documentClone = this._pathCast(documentClone, path);
        if (Connection.isDataModel(documentClone)) delete documentClone._timestamp;

        return documentClone;
    }

    /**
     * Manages the deletion of the database.
     * @param {...Pathlike} keyContexts Specifies which rows to remove from the database.
     * @returns {Connection}
     */
    erase(...keyContexts) {
        const rows = keyContexts
            .map(key => this._resolveKeyPath(key)[0]);

        if (rows.length) {
            // TODO:
            // Implement eviction method and replace this function with that method.
            rows.forEach(key => this.memory.delete(key));
            const escapeCharacters = rows
                .map(_ => "?")
                .join(", ");
            this.API
                .prepare(`DELETE FROM '${this.table}' WHERE Key IN ${escapeCharacters}`)
                .run(...rows);
        }

        return this;
    }

    // Search methods
    // ... exists, each, find, select

    // Array methods
    // ... push, shift, pop, remove, slice

    // Utility methods
    // ... ensure, modify, insert
}

module.exports = Connection;
