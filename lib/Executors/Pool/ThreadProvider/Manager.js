
"use strict";

const Queue = require("qulity/lib/Integrations/Queue");
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

        /**
         * Manager's current queue for ordering
         * asynchronous database requests.
         * @name ThreadProvider#Queue
         * @type {Array}
         * @private
         */
        Object.defineProperty(this, "Queue", {
            value: []
        });

        /**
         * Manager's current database request.
         * @name ThreadProvider#Job
         * @type {Object}
         * @private
         */
        Object.defineProperty(this, "Job", {
            value: null
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
        .on("online", () => this._Poll())
        .on("error", Err => ThreadError = Err)
        .on("exit", ExitCode => {
            if (this.Job) this.Job.Reject(ThreadError);

            if (ExitCode !== 0) {
                console.error(`Pool thread died (${ExitCode}): \n`, ThreadError);
                return this._Spawn();
            } else {
                this._Worker = null;
            }
        })
        .on("message", Result => {
            this.Job.Resolve(Result);
            this.Job = null;
            this._Poll();
        });
    }

    _Poll () {
        if (this.Queue.length && this._Worker) {
            this.Job = this.Queue.shift();
            this._Worker.postMessage({
                Identifier, Method, Parameters
            } = this.Job);
        } else {
            setImmediate(() => this._Poll());
        }
    }

}

module.exports = ThreadProvider;
