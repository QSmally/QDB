
"use strict";

const SQL = require("better-sqlite3");

const Generics        = require("./Generics");
const Journal         = require("./Enumerations/Journal");
const CacheStrategy   = require("./Enumerations/CacheStrategy");
const Synchronisation = require("./Enumerations/Synchronisation");

const { readdirSync } = require("fs");

class Connection {

    /**
     * A set of options for a QDB Connection instance.
     * @typedef {Object} QDBConfiguration
     * @property {String} [table] A name for the table to use at the path for this Connection.
     * @property {Journal} [journal] The journal mode of this database, which defaults to Write Ahead Logging. See https://sqlite.org/pragma.html#pragma_journal_mode.
     * @property {Number} [diskCacheSize] The maximum amount of pages on disk SQLite will hold. See https://sqlite.org/pragma.html#pragma_cache_size.
     * @property {Synchronisation} [synchronisation] SQLite synchronisation, which defaults to 'normal'. See https://sqlite.org/pragma.html#pragma_synchronous.
     * @property {CacheStrategy} [cache] A cache strategy and host for the 'memory' property of the Connection.
     * @property {Boolean} [insertionCache] Automatically inserts the new entry of a `set` operation into the Connection's internal cache.
     * @property {Number} [fetchAll] If enabled, an integer being the batch size of each database call and insertion to eventually fetch everything.
     */

    /**
     * Path string to navigate data models.
     * @typedef {String} Pathlike
     */

    /**
     * An entry which has been fetched from the Connection's internal cache.
     * @typedef {Object|Array} DataModel
     * @property {Number} _timestamp Timestamp when this entry was last resolved or patched, provided by the cache.
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

            cache: CacheStrategy.managed(),
            insertionCache: true,
            fetchAll: null,

            ...configuration
        };

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
                .prepare(`CREATE TABLE IF NOT EXISTS '${this.table}' ('Key' VARCHAR PRIMARY KEY, 'Val' TEXT);`)
                .run();
            this.API.pragma(`journal_mode = ${this.configuration.journal};`);
            this.API.pragma(`cache_size = ${this.configuration.diskCacheSize};`);
            this.API.pragma(`synchronous = ${this.configuration.synchronisation};`);
        }

        readdirSync("Sources/Modifiers/")
            .filter(file => file.endsWith(".js"))
            .map(file => require(`./Modifiers/${file}`))
            .map(Modifier => new Modifier(this));
    }

    /**
     * Table name of this Connection.
     * @name Connection#table
     * @type {String}
     * @readonly
     */
    get table() {
        return this.configuration.table;
    }

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
     * Internal computed property.
     * A Connection's internal memory controller to hold its cache.
     * @name Connection#cacheController
     * @type {CacheStrategy}
     * @private
     */
    get cacheController() {
        return this.configuration.cache;
    }

    /**
     * Internal computed property.
     * In-memory cached rows.
     * @name Connection#memory
     * @type {Collection<String, DataModel>}
     * @private
     */
    get memory() {
        return this.configuration.cache.memory;
    }

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

    // Integrations
    // ... iterator, transaction

    * [Symbol.iterator]() {
        yield* this.API
            .prepare(`SELECT Key, Val FROM '${this.table}';`)
            .all()
            .map(row => [row["Key"], JSON.parse(row["Val"])]);
    }

    // Standard methods

    /**
     * Manages the elements of the database.
     * @param {Pathlike} pathContext Specifies at which row and nested property to insert or replace the element at.
     * @param {DataModel|*} document Any data to set at the row address or the location of the key-path.
     * @param {Boolean} [cache] A flag to insert this entry into the Connection's cache if not already, defaults to the `insertionCache` configuration option.
     * @returns {Connection}
     */
    set(pathContext, document, cache = this.configuration.insertionCache) {
        const [keyContext, path] = this._resolveKeyPath(pathContext);

        if (path.length) {
            const documentOld = this.fetch(keyContext) ?? {};
            document = this._pathCast(documentOld, path, document);
        } else {
            if (!Generics.isDataModel(document))
                throw new TypeError("Type of 'document' must be a data model for the root path.");
        }

        this.API
            .prepare(`INSERT OR REPLACE INTO '${this.table}' ('Key', 'Val') VALUES (?, ?);`)
            .run(keyContext, JSON.stringify(document));

        if (cache || this.memory.has(keyContext) || this.configuration.fetchAll > 0) {
            this.cacheController.patch(keyContext, document);
        }

        return this;
    }

    /**
     * Manages the retrieval of the database.
     * @param {Pathlike} pathContext Specifies which row and nested property to fetch or get from the cache.
     * @param {Boolean} [cache] A flag to insert this entry into the Connection's cache, defaults to true.
     * @returns {*}
     */
    fetch(pathContext, cache = true) {
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
        if (cache && !this.memory.has(keyContext)) this.cacheController.patch(keyContext, fetched);

        let documentClone = Generics.clone(fetched);
        if (path.length) documentClone = this._pathCast(documentClone, path);
        if (Generics.isDataModel(documentClone)) delete documentClone._timestamp;

        return documentClone;
    }

    /**
     * Manages the deletion of elements from the Connection's internal cache.
     * @param {...Pathlike} keyContexts Specifies which rows to evict from the Connection's internal cache.
     * @returns {Connection}
     */
    evict(...keyContexts) {
        if (keyContexts.length) {
            keyContexts
                .map(key => this._resolveKeyPath(key)[0])
                .forEach(keyContext => this.memory.delete(keyContext));
        } else {
            this.memory.clear();
        }

        return this;
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
            this.evict(...rows);
            const escapeCharacters = rows
                .map(_ => "?")
                .join(", ");
            this.API
                .prepare(`DELETE FROM '${this.table}' WHERE Key IN (${escapeCharacters});`)
                .run(...rows);
        }

        return this;
    }

    // Search methods
    // ... exists, each, find, select

    // Array methods
    // ... push, shift, pop, remove, slice

    // Utility methods
    // ... ensure, modify, invert
}

module.exports = Connection;
