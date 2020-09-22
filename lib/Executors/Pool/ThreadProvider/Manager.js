
"use strict";

const {Worker} = require("worker_threads");

class ThreadProvider {

    /**
     * A gateway provider to communicate to the Connections
     * this ThreadProvider holds as separate worker threads.
     * @param {Pool} Pool The Pool reference this ThreadProvider was initialised with.
     */
    constructor (Pool) {

        /**
         * Defines the communication gateway
         * to the shard of this provider.
         * @name ThreadProvider#_Thread
         * @type {Worker}
         * @private
         */
        Object.defineProperty(this, "_Thread", {
            value: new Worker()
        });

    }

}

module.exports = ThreadProvider;
