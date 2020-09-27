
"use strict";

const {Worker} = require("worker_threads");

class ThreadProvider {

    /**
     * A class to communicate to the thread this ThreadProvider holds.
     * @param {Pool} Pool The Pool reference this ThreadProvider was initialised with.
     */
    constructor (Pool) {

        /**
         * The Pool reference of this ThreadProvider.
         * @name ThreadProvider#Pool
         * @type {Pool}
         * @readonly
         */
        Object.defineProperty(this, "Pool", {
            enumerable: true,
            value: Pool
        });

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

        this._Spawn();

    }


    _Spawn () {
        this._Worker = new Worker("./lib/Executors/Pool/ThreadProvider/Shard.js", {
            workerData: {Path: this.Pool.Path, Ops: this.Pool.ValOptions},
            stdout: process.stdout
        });

        let ThreadError = null;

        this._Worker
        .on("online", this._Poll)
        .on("error", Err => ThreadError = Err)
        .on("exit", ExitCode => {
            if (Code !== 0) {
                console.error(`Pool thread died (${ExitCode}): \n`, ThreadError);
                return this._Spawn();
            } else {
                this._Worker = null;
            }
        })
    }

}

module.exports = ThreadProvider;
