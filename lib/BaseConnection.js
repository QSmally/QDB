
"use strict";

class BaseConnection {

    /**
     * Base class of a connection.
     * @example class MyConnection extends BaseConnection
     */
    constructor () {

        /**
         * Path string to the database.
         * @name BaseConnection#Path
         * @type {Pathlike}
         * @readonly
         */
        this.Path = null;

        /**
         * Current state of the connection.
         * @name BaseConnection#State
         * @type {String}
         * @readonly
         */
        this.State = "BASE";

    }

}

module.exports = BaseConnection;
