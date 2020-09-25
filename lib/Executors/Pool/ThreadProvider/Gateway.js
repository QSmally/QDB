
"use strict";

class Gateway {

    constructor (PathURL, _, Pool) {

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
