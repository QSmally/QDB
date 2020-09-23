
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
         * @name ThreadProvider#_Worker
         * @type {Worker}
         * @private
         */
        Object.defineProperty(this, "_Worker", {
            writable: true
        });

        (function Spawn() {
            this._Worker = new Worker("./Shard.js", {
                workerData: Pool.ValOptions
            });

            let ThreadErr = null;

            this._Worker.on("error", Err => {
                ThreadErr = Err;
            }).on("exit", Code => {
                if (Code !== 0) {
                    console.error(`Pool thread died (${Code}) with error: \n`, ThreadErr);
                    return Spawn();
                }
            });
        })();

    }

}

module.exports = ThreadProvider;
