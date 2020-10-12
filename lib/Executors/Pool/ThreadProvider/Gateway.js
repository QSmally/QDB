
"use strict";

class Gateway {

    /**
     * Identical to a Connection, but communicates with a thread instead.
     * @param {Pathlike} PathURL Path to the database file of this Gateway.
     * @param {RawOptions} _ValOptions Partial options for this Gateway.
     * @param {Pool} Pool Reference to this Gateway's instance Pool.
     */
    constructor (PathURL, {Identifier, Table}, Pool) {

        /**
         * Path string and database identifier.
         * @name Gateway#Identifiers
         * @type {Array<Pathlike, String>}
         * @readonly
         */
        Object.defineProperty(this, "Identifiers", {
            enumerable: true,
            value: [PathURL, Identifier, Table]
        });

        /**
         * The Pool reference of this Gateway.
         * @name Gateway#Pool
         * @type {Pool}
         * @readonly
         */
        Object.defineProperty(this, "Pool", {
            enumerable: true,
            value: Pool
        });

        /**
         * A manager which holds the worker thread.
         * @name Gateway#_ThreadProvider
         * @type {ThreadProvider}
         * @private
         */
        Object.defineProperty(this, "_ThreadProvider", {
            value: Pool._ThreadProvider
        });

    }


    /**
     * Asynchronously creates a query for this database.
     * @param {String} Method Method or property of the Connection to select.
     * @param {...Any} Parameters Additional parameters to give to the function.
     * @returns {Promise<Any>} Result from the thread.
     */
    async Query (Method, ...Parameters) {
        if (typeof Method !== "string") return null;
        if (!this._ThreadProvider)      return null;

        return this._ThreadProvider.Query(
            this.Identifiers[1],
            Method, Parameters
        );
    }


    /**
     * Manages the elements of the database.
     * Asynchronously performs this query.
     * @param {Pathlike} KeyOrPath Specifies at what row to insert or replace the element at.
     * @param {Object|Array|*} Value Data to set at the row address, at the location of the key or path.
     * @returns {Promise<Any>} Result from the thread.
     */
    async Set (KeyOrPath, Value) {
        if (!this._ThreadProvider) return null;
        return this.Query("Set", KeyOrPath, Value);
    }

    /**
     * Manages the retrieval of the database.
     * Asynchronously performs this query.
     * @param {Pathlike} KeyOrPath Specifies which row to fetch from the database.
     * @returns {Promise<Any>} Result from the thread.
     */
    async Fetch (KeyOrPath) {
        if (!this._ThreadProvider) return null;
        return this.Query("Fetch", KeyOrPath);
    }

    /**
     * Manages the deletion of the database.
     * Asynchronously performs this query.
     * @param {...Pathlike} Keys A key or multiple keys to remove from the database.
     * @returns {Promise<Any>} Result from the thread.
     */
    async Erase (...Keys) {
        if (!this._ThreadProvider) return null;
        return this.Query("Erase", ...Keys);
    }

}

module.exports = Gateway;
