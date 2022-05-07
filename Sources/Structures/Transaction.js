
"use strict";

class Transaction {

    /**
     * A SQL transaction controller.
     * @param {Connection} connection A Connection this Transaction is referring to.
     * @example const transaction = <Connection>.transaction();
     */
    constructor(connection) {
        /**
         * Transaction's Connection reference.
         * @name Transaction#connection
         * @type {Connection}
         * @readonly
         */
        this.connection = connection;

        /**
         * Whether this Transaction is still active.
         * @name Transaction#active
         * @type {Boolean}
         * @readonly
         */
        this.active = true;

        this.connection.API.prepare("BEGIN;").run();
    }

    /**
     * Publishes the changes made during this Transaction.
     * @returns {Boolean} Whether the changes were committed or not.
     */
    commit() {
        if (!this.active) return false;

        this.connection.API.prepare("COMMIT;").run();
        this.active = false;
        return true;
    }

    /**
     * Rolls back the changes made before the start of this Transaction, and
     * also clears the contents of the Connection's internal cache.
     * @returns {Boolean} Whether the changes were rolled back or not.
     * @todo Invalidate only the entries which were added or modified, not everything.
     */
    rollback() {
        if (!this.active) return false;

        this.connection.API.prepare("ROLLBACK;").run();
        this.connection.memoryStore.clear();
        this.active = false;
        return true;
    }
}

module.exports = Transaction;
