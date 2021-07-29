
"use strict";

class Transaction {

    /**
     * A SQL transaction manager.
     * @param {Connection} _connection A Connection this Transaction is referring to.
     * @example const transaction = myDB.transaction();
     */
    constructor (_connection) {
        /**
         * Transaction's Connection reference.
         * @name Transaction#_connection
         * @type {Connection}
         * @private
         */
        Object.defineProperty(this, "_connection", {
            value: _connection
        });

        /**
         * Whether this Transaction is active.
         * @name Transaction#active
         * @type {Boolean}
         * @readonly
         */
        Object.defineProperty(this, "active", {
            enumerable: true,
            writable:   true,
            value:      true
        });

        this._connection.API.prepare("BEGIN;").run();
    }


    /**
     * Publishes the changes made during this Transaction.
     * @returns {Boolean} Whether the changed were committed.
     */
    commit () {
        if (!this.active)                        return false;
        if (!this._connection.API.inTransaction) return false;
        if (!this._connection._ready)            return false;

        this._connection.API.prepare("COMMIT;").run();
        this.active = false;
        return true;
    }

    /**
     * Rolls back the changes made before the start of this Transaction.
     * This also clears the contents of the Connection's internal cache.
     * @returns {Boolean} Whether the changed were reset.
     */
    rollback () {
        if (!this.active)                        return false;
        if (!this._connection.API.inTransaction) return false;
        if (!this._connection._ready)            return false;

        this._connection.memory.clear();
        this._connection.API.prepare("ROLLBACK;").run();
        this.active = false;
        return true;
    }
}

module.exports = Transaction;
