
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
         * Whether this Transaction is active.
         * @name Transaction#Active
         * @type {Boolean}
         * @readonly
         */
        Object.defineProperty(this, "Active", {
            enumerable: true,
            value: true
        });

    }

}

module.exports = Transaction;
