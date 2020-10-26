
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
            writable: true,
            value: null
        });

        this._Spawn();

    }


    /**
     * Spawns a new thread for this ThreadProvider, and
     * overwriting it as the new worker for this Pool.
     * @returns {undefined}
     * @private
     */
    _Spawn () {
        this._Worker = new Worker("./lib/Executors/Pool/ThreadProvider/Shard.js", {
            workerData: {Path: this.Pool.Path, Ops: this.Pool.ValOptions}
        });

        let ThreadError = null;

        this._Worker
        .on("online", () => this._Poll())
        .on("error", Err => ThreadError = Err)
        .on("exit", ExitCode => {
            if (this.Job && this.Job.Instruction !== "EXIT")
            this.Job.Reject(ThreadError || new Error("Thread died"));

            if (ExitCode !== 0) {
                console.error(`Pool thread died (${ExitCode}):\n`, ThreadError);
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

    /**
     * Checks whether there are any new queries for
     * this database Pool, and if not, polls it again
     * the next event loop cycle.
     * @returns {undefined}
     * @private
     */
    _Poll () {
        if (this.Queue.length && this._Worker) {
            this.Job = this.Queue.shift();
            const {Instruction, Identifier, Method, Parameters} = this.Job;
            this._Worker.postMessage({Instruction, Identifier, Method, Parameters});
        } else {
            setImmediate(() => this._Poll());
        }
    }


    /**
     * Inserts a new query into this Pool's request queue,
     * for it to be asynchronously managed by the thread.
     * @param {String} Instruction Instruction for the thread to execute, either QUERY or EXIT.
     * @param {String} Identifier Instance identifier when performing an active query.
     * @param {String} Method Reference function to execute of the selected database.
     * @param {Any} [Parameters] Array with additional parameters when the Connection endpoint is a function.
     * @returns {Promise<Any>} Returns the result of the query in a Promise.
     */
    async Query (Instruction, Identifier, Method, Parameters) {
        return new Promise((Resolve, Reject) => {
            this.Queue.push({
                Resolve, Reject, Instruction,
                Identifier, Method, Parameters
            });
        });
    }

}

module.exports = ThreadProvider;