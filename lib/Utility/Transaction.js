
"use strict";

class Transaction {

    /**
     * A SQL transaction manager.
     * @param {Connection} _Connection 
     */
    constructor (_Connection) {

        /**
         * Transaction's Connection reference.
         * @name Transaction#_Connection
         * @type {Connection}
         * @private
         */
        Object.defineProperty(this, "_Connection", {
            value: _Connection
        });

        /**
         * The original entries of this Connection's cache.
         * @name Transaction#CacheChanges
         * @type {DataStore}
         * @private
         */
        Object.defineProperty(this, "CacheChanges", {
            value: _Connection.Cache.clone()
        });

        /**
         * Whether this Transaction is active.
         * @name Transaction#Active
         * @type {Boolean}
         * @readonly
         */
        Object.defineProperty(this, "Active", {
            enumerable: true,
            value: true
        });

        this._Connection.API.exec("BEGIN");

    }

}

module.exports = Transaction;
