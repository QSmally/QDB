
"use strict";

class PartialConnection {

    /**
     * Base of the Connection class, and fallback
     * class when a database failed to connect.
     * @abstract
     */
    constructor () {

        /**
         * Current state of this Connection.
         * @name PartialConnection#State
         * @type {String}
         * @readonly
         */
        Object.defineProperty(this, "State", {
            enumerable: true,
            writable: true,
            value: "PARTIAL"
        });

    }

}

module.exports = PartialConnection;
