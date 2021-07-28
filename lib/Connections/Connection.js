
"use strict";

const { Schema } = require("../Utility/Schema");

const Qulity = require("qulity");
const SQL    = require("better-sqlite3");

class Connection {

    /**
     * The main interface for interacting with QDB.
     * @param {Pathlike} pathURL Path to the database file of this Connection.
     * @param {RawOptions} [rawOptions] Options for this Connection.
     * @param {Pool} [_poolController] Reference to a Pool if this database was instantiated in a Pool.
     * @example const Users = new QDB.Connection("lib/Databases/Users.qdb");
     */
    constructor (pathURL, rawOptions = {}, _poolController = undefined) {

        /**
         * Current state of this Connection.
         * @name Connection#state
         * @type {String}
         * @readonly
         */
        Object.defineProperty(this, "state", {
            enumerable: true,
            writable:   true,
            value:      "CONNECTED"
        });

        /**
         * Path string to the database.
         * @name Connection#path
         * @type {Pathlike}
         * @readonly
         */
        Object.defineProperty(this, "path", {
            enumerable: true,
            value: pathURL
        });

        /**
         * Options for this Connection.
         * @name Connection#valOptions
         * @type {RawOptions}
         * @readonly
         */
        Object.defineProperty(this, "valOptions", {
            value: {
                table:  "QDB",
                schema: undefined,
                WAL:    true,

                cache:     true,
                fetchAll:  false,
                utilCache: true,

                cacheMaxSize:  false,
                sweepInterval: 300000,
                sweepLifetime: 150000,

                ...rawOptions
            }
        });

        /**
         * Reference to the Pool this Connection was created in.
         * @name Connection#poolController
         * @type {Pool?}
         * @readonly
         */
        Object.defineProperty(this, "poolController", {
            enumerable: true,
            value: _poolController || null
        });

        /**
         * Table name of this Connection.
         * @name Connection#table
         * @type {String}
         * @readonly
         */
        Object.defineProperty(this, "table", {
            enumerable: true,
            value: this.valOptions.table || "QDB"
        });

        /**
         * Raw SQL property.
         * @name Connection#API
         * @type {SQL}
         * @link https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md
         * @private
         */
        Object.defineProperty(this, "API", {
            value: new SQL(PathURL, {
                verbose: rawOptions.queries
            })
        });

        /**
         * In-memory cached rows.
         * @name Connection#memory
         * @type {Collection}
         * @link https://github.com/QSmally/Qulity/blob/master/Documentation/Collection.md
         * @private
         */
        Object.defineProperty(this, "memory", {
            value: new Qulity.Collection()
        });


        if (!this.API) {
            throw new Error("A QDB Connection could not be created.");
        } else {
            this.API.prepare(`CREATE TABLE IF NOT EXISTS '${this.table}' ('Key' VARCHAR PRIMARY KEY, 'Val' TEXT);`).run();
            this.API.pragma(`journal_mode = ${this.valOptions.WAL ? "wal" : "delete"};`);
            this.API.pragma("cache_size = 64000;");
            this.API.pragma("synchronous = 1;");
        }


        /**
         * An object with all additional active operators.
         * I.e. sweep intervals, backups, fetch all entries.
         * @name Connection#_executors
         * @type {Object}
         * @private
         */
        Object.defineProperty(this, "_executors", {
            value: {}
        });

        const executors = require("./Executors/Index");
        for (const method in executors) {
            if (this.valOptions[method])
                this._executors[method] = executors[method](this);
        }
    }


    /**
     * Retrieves all the rows of this Connection.
     * @name Connection#size
     * @type {Number}
     */
    get size () {
        if (!this._ready) return 0;
        return this.API
            .prepare(`SELECT COUNT(*) FROM '${this.table}';`)
            .get()["COUNT(*)"];
    }

    /**
     * Retrieves all the in-memory cached rows of this Connection.
     * Extension of what would be `<Connection>.memory.size`, but checks for the ready state.
     * @name Connection#cacheSize
     * @type {Number}
     */
    get cacheSize () {
        if (!this._ready) return 0;
        return this.memory.size;
    }

    /**
     * Retrieves all the keys of this database table.
     * @name Connection#indexes
     * @type {Array}
     */
    get indexes () {
        if (!this._ready) return [];
        return this.API
            .prepare(`SELECT Key FROM '${this.table}';`)
            .all()
            .map(row => row.Key);
    }

    /**
     * Disconnects from this Connection, clears in-memory rows.
     * Only run this method when you are exiting the program,
     * or want to fully disconnect from this database.
     * @returns {Connection}
     */
    Disconnect () {
        this.API.close();
        this.memory.clear();
        this.state = "DISCONNECTED";

        clearInterval(this._executors.sweepInterval);

        return this;
    }


    // ---------------------------------------------------------------- Private methods

    /**
     * Internal getter.
     * Checks whether this database is ready for execution.
     * @name Connection#_ready
     * @type {Boolean}
     * @private
     */
    get _ready () {
        return this.state === "CONNECTED" && this.API.open;
    }

    /**
     * Internal method.
     * Resolves a dotaccess path or key and parses it.
     * @param {Pathlike} pathlike String input to be formed and parsed.
     * @returns {Array<String, Array?>} Array containnig a 'key' and an optional 'path'.
     * @private
     */
    _resolve (pathlike) {
        const path = pathlike.split(/\.+/g);
        return [path[0], path.length > 1 ? path.slice(1) : undefined];
    }

    /**
     * Internal method.
     * Inserts or patches something in this Connection's internal cache.
     * @param {String|Number} key As address to memory map this value to.
     * @param {Object|Array} document The value to set in the memory cache.
     * @returns {Collection} Returns the updated cache instance of this Connection.
     * @link https://github.com/QSmally/Qulity/blob/master/Documentation/Collection.md
     * @private 
     */
    _patch (key, document) {
        if (this.valOptions.cacheMaxSize &&
            this.memory.size >= this.valOptions.cacheMaxSize &&
            !this.memory.has(key)) return this.memory;

        const value = document instanceof Array ? [...document] : {...document};
        value._timestamp = Date.now();
        this.memory.set(key, value);

        return this.memory;
    }

    /**
     * Internal method.
     * Finds a relative dotaccess pathway of an object.
     * @param {Object|Array} frame The object-like beginning to cast.
     * @param {Array} pathlike A dotaccess notation path as an Array. Preferred `Path` value from `_Resolve()`.
     * @param {*} [item] A value to cast into the inputted frame object.
     * @returns {*} Returns the output of the caster.
     * @private
     */
    _castPath (frame, pathlike, item = undefined) {
        const originalObject = frame;
        const lastFrameKey = pathlike.pop();

        for (const key of pathlike) {
            if (typeof frame !== "object") return;

            if (!(key in frame)) {
                if (!item) return;
                frame[key] = {};
            }

            frame = frame[key];
        }

        if (frame) {
            if (item === undefined) return frame[lastFrameKey];
            frame[lastFrameKey] = item;
            return originalObject;
        }
    }


    // ---------------------------------------------------------------- Integrations

    * [Symbol.iterator] () {
        const items = this.API
            .prepare(`SELECT Key, Val FROM '${this.table}';`)
            .all();
        yield* items.map(row => [row.Key, JSON.parse(row.Val)]);
    }

    /**
     * Converts this database's rows into an Object. To use dotaccess, use `fetch` instead.
     * @returns {Object} An object instance with the key/value pairs of this database.
     */
    asObject () {
        if (!this._ready) return null;
        const enumeratedEntries = this.API
            .prepare(`SELECT Key, Val FROM '${this.table}';`)
            .all()
            .map(row => [row.Key, JSON.parse(row.Val)]);
        return Object.fromEntries(enumeratedEntries);
    }

    /**
     * Converts this database, or a part of it using dotaccess, to a Manager instance.
     * @param {Pathlike} [pathlike] Optional dotaccess path pointing towards what to serialise.
     * @param {Function} [holds] Given optional class for which instance this Manager is for.
     * @returns {Manager} A Manager instance with the key/model pairs.
     * @link https://github.com/QSmally/Qulity/blob/master/Documentation/BaseManager.md
     */
    toIntegratedManager (pathlike = null, holds = null) {
        if (!this._ready) return null;
        if (pathlike && typeof pathlike !== "string") return null;

        const iterable = typeof pathlike === "undefined" ?
            this.fetch(pathlike) :
            this.API
                .prepare(`SELECT Key, Val FROM '${this.table}';`)
                .all()
                .map(row => [row.Key, JSON.parse(row.Val)]);

        return new Qulity.Manager(iterable, holds);
    }

    /**
     * Creates a SQL transaction, which allows you to commit or rollback changes.
     * @returns {Transaction?} A Transaction instance, or a nil value when already in a transaction.
     */
    transaction () {
        if (this.API.inTransaction) return;
        const Transaction = require("../Utility/Transaction");
        return new Transaction(this);
    }


    // ---------------------------------------------------------------- Database methods

    /**
     * Manages the elements of the database.
     * @param {Pathlike} keyOrPath Specifies at what row to insert or replace the element at. Use dotaccess notation to edit properties.
     * @param {Object|Array|DataModel|*} document Data to set at the row address, at the location of the key or path.
     * @returns {Connection} Returns the current Connection.
     */
    set (keyOrPath, document) {
        if (!this._ready)                  return null;
        if (typeof keyOrPath !== "string") return null;
        if (document === undefined)        return null;

        const [key, path] = this._resolve(keyOrPath);

        if (typeof path !== "undefined") document = this._castPath(this.fetch(key) || {}, path, document);
        else if (typeof document !== "object") return null;
        if (this.memory.has(key)) this._patch(key, document);

        this.API
            .prepare(`INSERT OR REPLACE INTO '${this.table}' ('Key', 'Val') VALUES (?, ?);`)
            .run(key, JSON.stringify(document));

        return this;
    }

    /**
     * Manages the retrieval of the database.
     * @param {Pathlike} keyOrPath Specifies which row to fetch or get from cache. Use dotaccess to retrieve properties.
     * @param {Boolean} [cache] Whether to, if not already, cache this entry in results that the next retrieval would be much faster.
     * @returns {Object|Array|DataModel|*} Value of the row, or the property when using dotaccess.
     */
    Fetch (keyOrPath, cache = this.valOptions.cache) {
        if (!this._ready) return null;
        if (typeof keyOrPath !== "string") return null;

        const [key, path] = this._Resolve(keyOrPath);

        let fetched = this.memory.get(key) || (() => {
            const document = this.API.prepare(`SELECT Val FROM '${this.table}' WHERE Key = ?;`).get(Key);
            if (typeof document !== "undefined") return JSON.parse(document.Val);
            return document;
        })();

        if (fetched === null || fetched === undefined) return fetched;
        if (cache && !this.memory.has(key)) this._patch(key, fetched);

        fetched = fetched instanceof Array ? [...fetched] : {...fetched};
        if (typeof path !== "undefined") fetched = this._castPath(fetched, path);
        if (fetched && typeof fetched === "object") delete fetched._timestamp;

        return fetched;
    }

    /**
     * Erases elements from this Connection's internal cache.
     * @param {...Pathlike} [keys] A key or multiple keys to remove from cache. If none, the cache will get cleared entirely.
     * @returns {Connection} Returns the current Connection.
     */
    evict (...keys) {
        if (!this._ready) return null;
        if (!(keys instanceof Array)) return null;

        const rows = keys
            .filter(keyOrPath => typeof keyOrPath === "string")
            .map(keyOrPath => this._resolve(keyOrPath)[0]);

        if (!rows.length) this.memory.clear();
        else for (const key of rows) this.memory.delete(key);
        return this;
    }

    /**
     * Manages the deletion of the database.
     * @param {...Pathlike} keys A key or multiple keys to remove from the database.
     * These elements will also get removed from this Connection's internal cache.
     * @returns {Connection} Returns the current Connection.
     */
    erase (...keys) {
        if (!this._ready) return null;
        if (!(keys instanceof Array)) return null;

        const rows = keys
            .filter(keyOrPath => typeof keyOrPath === "string")
            .map(keyOrPath => this._resolve(keyOrPath)[0]);

        if (rows.length) {
            this.evict(...rows);
            this.API
                .prepare(`DELETE FROM '${this.table}' WHERE Key IN (${rows.map(_ => "?").join(", ")});`)
                .run(...rows);
        }

        return this;
    }


    // ---------------------------------------------------------------- Look up functions

    /**
     * Returns whether or not a row in this database exists. This method also caches
     * the row internally, so fetching it afterwards would be much faster.
     * @param {Pathlike} key Specifies which row to see if it exists.
     * @param {Boolean} [cache] Whether or not to cache the fetched entry.
     * @returns {Boolean} Whether or not a row exists in this database.
     */
    exists (key, cache = this.valOptions.utilCache) {
        if (!this._ready) return false;
        if (typeof key !== "string") return false;

        const fetched = this.fetch(key, cache);
        return fetched !== undefined;
    }

    /**
     * Iterates through this database's entries.
     * @param {Function} method A function which passes on the iterating entries.
     * @returns {Connection} Returns the current Connection.
     */
    each (method) {
        if (!this._ready) return null;
        if (typeof method !== "function") return null;

        const rows = this.API.prepare(`SELECT Key, Val FROM '${this.Table}';`).all();
        for (const entry of rows) method(JSON.parse(entry.Val), entry.Key);

        return this;
    }

    /**
     * Iterates through all the entries of the database, returns the first element found.
     * @param {Function} predicate A tester function which returns a boolean, based on the value(s) of the rows.
     * @returns {Object|Array|DataModel} Returns the row which was found, or a nil value.
     */
    find (predicate) {
        if (!this._ready) return null;
        if (typeof predicate !== "function") return null;

        if (this.valOptions.cache) {
            for (const [key, document] of this.memory)
                if (predicate(document, key)) return document;
        }

        const iterableRows = this.API
            .prepare(`SELECT Key, Val FROM '${this.table}';`)
            .iterate();

        for (const entry of iterableRows) {
            const column = JSON.parse(entry.Val);
            if (Fn(column, entry.Key)) return column;
        }

        return undefined;
    }

    /**
     * Locally filters out rows in memory to work with.
     * Please note that this method does increase memory usage in large databases.
     * @param {Function|Pathlike} predicateOrPath A filter function or a path to a row.
     * @returns {Selection} A Selection class instance.
     */
    select (predicateOrPath = () => true) {
        if (!this._ready) return null;

        const entries = typeof predicateOrPath === "string" ? this.fetch(predicateOrPath) : (() => {
            if (typeof predicateOrPath !== "function") return {};
            const rows = this.API.prepare(`SELECT Key, Val FROM '${this.Table}';`).all();
            const results = {};

            for (const entry of rows) {
                const decodedEntry = JSON.parse(entry.Val);
                if (predicateOrPath(decodedEntry, entry.Key))
                    results[entry.Key] = decodedEntry;
            }

            return results;
        })();

        const Selection = require("../Utility/Selection");
        return new Selection(entries, this.table);
    }


    // ---------------------------------------------------------------- Array methods

    /**
     * Pushes something to an array at the path output.
     * @param {Pathlike} keyOrPath Specifies which row or nested array to push to.
     * @param {...Any} values Values to insert and push to this array.
     * @returns {Number} New length of the array.
     */
    push (keyOrPath, ...values) {
        if (!this._ready)                  return null;
        if (typeof keyOrPath !== "string") return null;
        if (!(values instanceof Array))    return null;

        const origin = this.fetch(keyOrPath);
        if (!(origin instanceof Array)) return null;

        origin.push(...values);
        this.set(keyOrPath, origin);
        return origin.length;
    }

    /**
     * Inserts (if defined) or removes a value to/from the front of the array.
     * @param {Pathlike} keyOrPath Specifies which row or nested array to insert to/remove from.
     * @param {...Any} [values] If defined, inserts new values at the front of the array.
     * @returns {Number|*} New length of the array if a value was inserted, or the shifted value.
     */
    shift (keyOrPath, ...values) {
        if (!this._ready)                  return null;
        if (typeof keyOrPath !== "string") return null;
        if (!(values instanceof Array))    return null;

        let shifted = undefined;
        const origin = this.fetch(keyOrPath);
        if (!(origin instanceof Array)) return null;

        values.length ?
            origin.unshift(...values) :
            shifted = origin.shift();
            
        this.set(keyOrPath, origin);

        return !values.length ?
            shifted :
            origin.length;
    }

    /**
     * Pops something from an array at the path output.
     * @param {Pathlike} keyOrPath Specifies which row or nested array to pop from.
     * @returns {*} Returns the popped value.
     */
    pop (keyOrPath) {
        if (!this._ready) return null;
        if (typeof keyOrPath !== "string") return null;

        const origin = this.fetch(keyOrPath);
        if (!(origin instanceof Array)) return null;

        const popped = origin.pop();
        this.set(keyOrPath, origin);
        return popped;
    }

    /**
     * Removes a specific element from this endpoint array.
     * @param {Pathlike} keyOrPath Specifies which row or nested array to remove a value from.
     * @param {Function|Number} predicateOrIdx Function or an index that specifies which item to remove.
     * @returns {Number} New length of the array.
     */
    remove (keyOrPath, predicateOrIdx) {
        if (!this._ready) return null;
        if (typeof keyOrPath !== "string") return null;

        const origin = this.fetch(keyOrPath);
        if (!(origin instanceof Array)) return null;

        if (typeof predicateOrIdx === "function") {
            for (const key in origin)
            if (predicateOrIdx(origin[key], key)) {
                origin.splice(key, 1);
                break;
            }
        } else {
            if (typeof predicateOrIdx !== "number") return origin.length;
            origin.splice(predicateOrIdx, 1);
        }

        this.set(keyOrPath, origin);
        return origin.length;
    }

    /**
     * Removes elements from this endpoint array based on indexes.
     * @param {Pathlike} keyOrPath Specifies which row or nested array to slice values from.
     * @param {Number} [startIdx] Beginning of the specified portion of the array.
     * @param {Number} [endIdx] End of the specified portion of the array.
     * @returns {Number} New length of the array.
     */
    slice (keyOrPath, startIdx, endIdx) {
        if (!this._ready) return null;
        if (typeof keyOrPath !== "string") return null;

        let origin = this.fetch(keyOrPath);
        if (!(origin instanceof Array)) return null;
        origin = origin.slice(startIdx, endIdx);

        this.set(keyOrPath, origin);
        return origin.length;
    }


    // ---------------------------------------------------------------- Utility methods

    /**
     * Inserts an input into a row or nested object if the key or path wasn't found at the endpoint.
     * It can be used as a default schema of the database elements, that gets inserted if there's no entry already.
     * @param {Pathlike} keyOrPath Context key to see if it exists, either a row or nested property, and optionally insert the new value.
     * @param {Object|Array|Schema|*} input A value to input if the row or nested property wasn't found in the database.
     * @param {Boolean} [merge] Whether or not to merge `Input` with this Connection's Schema model as initial values.
     * @returns {Boolean} Whether or not the new value was inserted.
     */
    ensure (keyOrPath, input = {}, merge = !!this.valOptions.schema) {
        if (!this._ready)                  return null;
        if (typeof keyOrPath !== "string") return null;
        if (typeof input === "undefined")  return null;

        const exists = this.exists(keyOrPath);
        merge = keyOrPath.includes(".") ? false : merge;

        if (!exists) {
            const value = merge && typeof input === "object" ?
                this.valOptions.schema.instance(input) :
                input;

            this.set(keyOrPath, value);
        }

        return !exists;
    }

    /**
     * Updates a value if the entry exists by fetching it and passing it onto the callback function.
     * @param {Pathlike} keyOrPath Specifies which row or nested property to fetch.
     * @param {Function} method Callback which includes the original value of the fetched row or property.
     * @returns {Object|Array|DataModel} Returns the new row of the updated property.
     */
    modify (keyOrPath, method) {
        if (!this._ready)                  return null;
        if (typeof keyOrPath !== "string") return null;
        if (typeof method !== "function")  return null;

        const origin = this.fetch(keyOrPath);
        const key    = this._resolve(keyOrPath)[0];

        if (typeof origin !== "undefined") {
            const value = method(origin, key);
            this.set(keyOrPath, value);
        }

        return origin ?
            this.fetch(key) :
            undefined;
    }

    /**
     * Inverts a boolean, from true to false and vice-versa, at the endpoint of the path.
     * @param {Pathlike} keyOrPath Specifies which row or nested property to boolean-invert.
     * @returns {Boolean} Returns the updated boolean value of the property.
     */
    invert (keyOrPath) {
        if (!this._ready) return null;
        if (typeof keyOrPath !== "string") return null;

        const insert = !this.fetch(keyOrPath);
        this.set(keyOrPath, insert);
        return insert;
    }
}

module.exports = Connection;


/**
 * Options for a database Connection.
 * All integer related options are in milliseconds.
 * @typedef {Object} RawOptions

 * @param {String} table A name for the table to use at this path for this Connection.
 * @param {Schema} schema Link to a database Schema class for automatic data migration.
 * @param {Boolean} WAL Whether or not to enable Write Ahead Logging mode.

 * @param {Function} queries A function that gets ran for each executed SQL query in QDB.

 * @param {Boolean} cache Whether to enable in-memory caching of entries in results that the next retrieval would be much faster.
 * @param {Boolean} fetchAll Whether or not to fetch all the database entries on start-up of this database Connection.
 * @param {Boolean} utilCache Whether or not to cache entries while performing utility tasks, such as the Exists method.

 * @param {Number} cacheMaxSize Amount to be considered the maximum size. If this threshold is hit, the cache will temporarily stop adding new entries.
 * @param {Number} sweepInterval Integer to indicate at what interval to sweep the entries of this Connection's internal cache.
 * @param {Number} sweepLifetime The minimum age of an entry in the cache to consider being sweepable after an interval.
 */

/**
 * An entry which has been resolved from the Connection's internal cache.
 * @typedef {Object|Array} DataModel
 * @param {Number} _timestamp Timestamp when this entry was last patched.
 */

/**
 * Path string to navigate files.
 * @typedef {String} Pathlike
 */
