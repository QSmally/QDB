
"use strict";

class PartialConnection {

    /**
     * Class when a database failed to connect.
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
