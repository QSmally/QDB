
"use strict";

const {Worker} = require("worker_threads");

class ThreadProvider {

    /**
     * A class to communicate to the thread this ThreadProvider holds.
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

        const Spawn = (() => {
            this._Worker = new Worker("./lib/Executors/Pool/ThreadProvider/Shard.js", {
                workerData: {Path: Pool.Path, Ops: Pool.ValOptions}
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
