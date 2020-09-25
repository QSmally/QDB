
"use strict";

class Gateway {

    /**
     * Identical to a Connection, but communicates with a thread instead.
     * @param {Pathlike} PathURL Path to the database file of this Gateway.
     * @param {RawOptions} _ValOptions Partial options for this Gateway.
     * @param {Pool} Pool Reference to this Gateway's instance Pool.
     */
    constructor (PathURL, {Identifier}, Pool) {

        /**
         * Path string to the database.
         * @name Gateway#Path
         * @type {Pathlike}
         * @readonly
         */
        Object.defineProperty(this, "Path", {
            enumerable: true,
            value: PathURL
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

}

module.exports = Gateway;
