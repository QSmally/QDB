
"use strict";

const { Collection } = require("qulity");
const SQL            = require("better-sqlite3");

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
     * @property {Boolean} [utilityCache] Automatically inserts the new entry of any utility operation, like `exists`, into the Connection's internal cache.
     * @property {Number} [fetchAll] If enabled, an integer being the batch size of each database call and insertion to eventually fetch everything.
     * @property {Schema|String} [model] A Schema for every entity in this Connection to follow.
     * @property {Boolean} [migrate] Whether to migrate every entity in the Connection's database to its (new) model.
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
            synchronisation: Synchronisation.normal,

            cache: CacheStrategy.managed(),
            insertionCache: true,
            utilityCache: true,
            fetchAll: null,

            model: null,
            migrate: false,

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

    // Private computed properties

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

    // Integrations

    * [Symbol.iterator]() {
        yield* this.API
            .prepare(`SELECT Key, Val FROM '${this.table}';`)
            .all()
            .map(row => [row["Key"], JSON.parse(row["Val"])]);
    }

    /**
     * Creates a SQL transaction which allows you to commit or rollback changes in
     * an optimised manner.
     * @returns {Transaction?} A Transaction instance, or a nil value if already in a transaction.
     */
    transaction() {
        if (this.API.inTransaction) return;
        const Transaction = require("./Structures/Transaction");
        return new Transaction(this);
    }

    /**
     * Disconnects from this Connection, clears the internal cache. Only run this
     * method when you are exiting the program, or want to fully disconnect from
     * this instance.
     * @returns {Connection}
     */
    disconnect() {
        this.API.close();
        this.memory.clear();

        if (this.cacheController.timer)
            clearInterval(this.cacheController.timer);
        return this;
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
        const [keyContext, path] = Generics.resolveKeyPath(pathContext);

        if (path.length) {
            const documentOld = this.fetch(keyContext) ?? {};
            document = Generics.pathCast(documentOld, path, document);
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
     * @param {Pathlike} pathContext Specifies which row or nested property to fetch or get from the cache.
     * @param {Boolean} [cache] A flag to insert this entry into the Connection's cache, defaults to true.
     * @returns {DataModel|*}
     */
    fetch(pathContext, cache = true) {
        const [keyContext, path] = Generics.resolveKeyPath(pathContext);

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
        if (path.length) documentClone = Generics.pathCast(documentClone, path);
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
                .map(key => Generics.resolveKeyPath(key)[0])
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
            .map(key => Generics.resolveKeyPath(key)[0]);

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

    /**
     * Returns whether or not a property in this database exists. As this method
     * fetches from the Connection, it will automatically be cached, making a
     * subsequent much faster.
     * @param {Pathlike} pathlike Specifies which row or nested property to see if it exists.
     * @param {Boolean} [cache] A flag to insert this entry into the Connection's cache if not already, defaults to the `utilityCache` configuration option.
     * @returns {Boolean}
     */
    exists(pathlike, cache = this.configuration.utilityCache) {
        const document = this.fetch(pathlike, cache);
        return document !== undefined;
    }

    /**
     * Iterates through the entries of the database, returns the first element
     * which passes the test. If enabled, the cache will first be scanned for a
     * passing entity.
     * @param {Function} predicate A tester function which returns a boolean based on the properties of the row.
     * @param {Boolean} [cache] A flag to first scan the cache before searching elements in the database, defaults to the `utilityCache` configuration option.
     * @returns {DataModel?}
     */
    find(predicate, cache = this.configuration.utilityCache) {
        if (cache) {
            for (const [keyContext, document] of this.memory)
                if (predicate(document, keyContext)) return document;
        }

        const rows = this.API
            .prepare(`SELECT Key, Val FROM '${this.table}';`)
            .all();

        for (const { Key: keyContext, Val: value } of rows) {
            const document = JSON.parse(value);
            if (predicate(document, keyContext)) return document;
        }
    }

    /**
     * Iterates through this database's elements.
     * @param {Function} iterator A function which passes on the iterating entities.
     * @returns {Connection}
     */
    each(iterator) {
        const rows = this.API
            .prepare(`SELECT Key, Val FROM '${this.table}';`)
            .all();

        for (const { Key: keyContext, Val: value } of rows)
            iterator(JSON.parse(value), keyContext);
        return this;
    }

    /**
     * Creates an in-memory Selection of rows based on the nested path, row or
     * filtered rows. It is to note that this method increases usage of memory by
     * a lot in large databases.
     * @param {Function|Pathlike} [predicateOrPathlike] A tester function or a path to a row or nested property.
     * @returns {Selection} A Selection instance.
     */
    select(predicateOrPathlike = () => true) {
        const selection = typeof predicateOrPathlike === "string" ?
            this.fetch(predicateOrPathlike, this.configuration.utilityCache) :
            (() => {
                const rows = this.API
                    .prepare(`SELECT Key, Val FROM '${this.table}';`)
                    .all();
                const accumulatedEntities = new Collection();

                for (const { Key: keyContext, Val: document } of rows) {
                    const decodedDocumentEntity = JSON.parse(document);
                    if (predicateOrPathlike(decodedDocumentEntity, keyContext))
                        accumulatedEntities.set(keyContext, decodedDocumentEntity);
                }

                return accumulatedEntities;
            })();

        const Selection = require("./Structures/Selection");
        return new Selection(selection, this.table);
    }

    // Array methods

    /**
     * Appends values to the end of the array at the located path.
     * @param {Pathlike} pathlike Specifies which row or nested property to fetch the an array.
     * @param {...Any} values A list of values to insert into the array.
     * @returns {Number} The new length of the array.
     */
    push(pathlike, ...values) {
        const sourceArray = this.fetch(pathlike, this.configuration.utilityCache);

        sourceArray.push(...values);
        this.set(pathlike, sourceArray);
        return sourceArray.length;
    }

    /**
     * Inserts or removes value(s) to/from the front of the array at the located
     * path.
     * @param {Pathlike} pathlike Specifies which row or nested property to fetch the an array.
     * @param {...Any} [values] If defined, inserts the new values at the front of the array, otherwise removes one.
     * @returns {Number|*} The new length of the array if values were added, or the shifted value.
     */
    shift(pathlike, ...values) {
        const sourceArray = this.fetch(pathlike, this.configuration.utilityCache);

        const returnable = values.length ?
            sourceArray.unshift(...values) :
            sourceArray.shift();

        this.set(pathlike, sourceArray);
        return returnable;
    }

    /**
     * Pops a value from the array at the located path.
     * @param {Pathlike} pathlike Specifies which row or nested property to fetch the an array.
     * @returns {*} A popped value.
     */
    pop(pathlike) {
        const sourceArray = this.fetch(pathlike, this.configuration.utilityCache);

        const popped = sourceArray.pop();
        this.set(pathlike, sourceArray);
        return popped;
    }

    /**
     * Removes a specific element from the array at the located path.
     * @param {Pathlike} pathlike Specifies which row or nested property to fetch the an array.
     * @param {Function|Number} predicateOrIndex A function or an index to indicate which element to remove.
     * @returns {Number} The new length of the array.
     */
    remove(pathlike, predicateOrIndex) {
        const sourceArray = this.fetch(pathlike, this.configuration.utilityCache);

        if (typeof predicateOrIndex === "function") {
            for (const index in sourceArray) {
                if (predicateOrIndex(sourceArray[index], index)) {
                    sourceArray.splice(index, 1);
                    break;
                }
            }
        } else {
            sourceArray.splice(predicateOrIndex, 1);
        }

        this.set(pathlike, sourceArray);
        return sourceArray.length;
    }

    /**
     * Inserts an extracted portion of the array at the located path based on the
     * indexes.
     * @param {Pathlike} pathlike Specifies which row or nested property to fetch the an array.
     * @param {Number} startIndex A zero-based index at whichi to start extraction.
     * @param {Number} [endIndex] An optional zero-based idnex before which to end extraction, and defaults to the length of the array.
     * @returns {Number} The new length of the array.
     */
    slice(pathlike, startIndex, endIndex) {
        const sourceArray = this.fetch(pathlike, this.configuration.utilityCache);

        const mutatedArray = sourceArray.slice(startIndex, endIndex);
        this.set(pathlike, mutatedArray);
        return mutatedArray.length;
    }

    // Utility methods

    /**
     * Inserts a value into a row or nested object if the endpoint of the path
     * returned undefined.
     * @param {Pathlike} pathlike Specifies at which row and nested property to optionally insert the element at.
     * @param {DataModel|*} document If the path doesn't already exist, any data to set at the address of the key-path.
     * @returns {DataModel}
     */
    ensure(pathlike, document) {
        if (!this.exists(pathlike)) {
            this.set(pathlike, document);
            return document;
        } else {
            return this.fetch(pathlike, this.configuration.utilityCache);
        }
    }

    /**
     * Updates any value by fetching it and passing it onto the callback function.
     * @param {Pathlike} pathlike Specifies which row or nested property to initially fetch.
     * @param {Function} newEntityCallback A function which accepts the old element, returning the new and updated element.
     * @returns {DataModel|*}
     */
    modify(pathlike, newEntityCallback) {
        const sourceEntity = this.fetch(pathlike, this.configuration.utilityCache);

        const mutatedEntity = newEntityCallback(sourceEntity, pathlike);
        this.set(pathlike, mutatedEntity);
        return mutatedEntity;
    }

    /**
     * Inverts a value and reinserts it, and returns the new property.
     * @param {Pathlike} pathlike Specifies which row or nested property to invert.
     * @returns {Boolean}
     */
    invert(pathlike) {
        const inversion = !this.fetch(pathlike, this.configuration.utilityCache);
        this.set(pathlike, inversion);
        return inversion;
    }
}

module.exports = Connection;
