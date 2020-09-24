
"use strict";

class Gateway {

    constructor (PathURL, ValOptions, Pool) {

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

    }

}

module.exports = Gateway;
