
"use strict";

class Transaction {

    /**
     * A SQL transaction manager.
     * @param {Connection} _Connection A Connection this Transaction is referring to.
     * @example const Transaction = MyDB.Transaction();
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

        this._Connection.API.exec("BEGIN");

    }


    /**
     * Commits the changes made during this transaction.
     * @returns {Boolean} Whether the changed were committed.
     */
    Commit () {
        if (!this._Connection._Ready) return false;
        if (!this._Connection.API.inTransaction) return false;
        this._Connection.API.exec("COMMIT");
        return true;
    }

    /**
     * Rolls back the changes made before the start of this Transaction.
     * This also clears the contents of the Connection's internal cache.
     * @returns {Boolean} Whether the changed were reset.
     */
    Rollback () {
        if (!this._Connection._Ready) return false;
        if (!this._Connection.API.inTransaction) return false;

        this._Connection.Cache.clear();
        this._Connection.API.exec("ROLLBACK");
        return true;
    }

}

module.exports = Transaction;
