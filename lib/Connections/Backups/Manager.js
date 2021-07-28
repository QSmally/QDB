
"use strict";

const Child = require("child_process");

const FS     = require("fs");
const Path   = require("path");
const Events = require("events");

class BackupManager {

    /**
     * A utility class for creating backups of databases.
     * @param {Pathlike} pathURL Path to the database file or directory to backup.
     * @param {BackupOptions} backupOptions Options to use for this Backup Manager.
     * @example new QDB.BackupManager("../Cellar/", { destination: "/usr/local/backups/" });
     * @extends {EventEmitter}
     */
    constructor (pathURL, backupOptions = {}) {
        if (FS.existsSync(pathURL)) {

            /**
             * Path string to a directory or database file.
             * @name BackupManager#path
             * @type {Pathlike}
             * @readonly
             */
            Object.defineProperty(this, "path", {
                enumerable: true,
                value: pathURL
            });

            /**
             * Options for this Manager.
             * @name BackupManager#valOptions
             * @type {BackupOptions}
             * @private
             */
            Object.defineProperty(this, "valOptions", {
                value: {
                    retry: true,

                    destination: "Backups/",
                    interval:    3600000,
                    snapshots:   24,

                    ...backupOptions
                }
            });

            /**
             * Path string to the destination of the backups.
             * @name BackupManager#destination
             * @type {Pathlike}
             * @readonly
             */
            Object.defineProperty(this, "destination", {
                enumerable: true,
                value: this.valOptions.destination
            });

        } else {
            throw new Error("Source directory or database file does not exist.");
        }


        /**
         * The child process that manages the backups.
         * @name BackupManager#_process
         * @type {Process?}
         * @private
         */
        Object.defineProperty(this, "_process", {
            writable: true,
            value: null
        });

        /**
         * This manager's event manager to control
         * the information of the backup child process.
         * @name BackupManager#_eventEmitter
         * @type {EventEmitter}
         * @private
         */
        Object.defineProperty(this, "_eventEmitter", {
            value: new Events()
        });

        this.Spawn();
    }


    /**
     * Registers an event listener on one of this Manager's events.
     * @param {String} event Which action to register for the listener.
     * @param {Function} listener Function to execute upon this event.
     * @returns {BackupManager}
     */
    on (event, listener) {
        this._eventEmitter.on(event, listener);
        return this;
    }

    /**
     * Spawns the child process for this Manager.
     * @returns {BackupManager}
     */
    spawn () {
        if (this._process) throw new Error("Backup process exists for this Manager.");

        this._process = Child.fork(Path.join(__dirname, "Process.js"), {
            env: { pathURL: this.path, ...this.valOptions }
        });

        this._process
            .on("exit",    C => this._eventEmitter.emit("exit", C))
            .on("error",   E => this._eventEmitter.emit("error", E))
            .on("message", M => this._eventEmitter.emit("debug", M));

        this._process.on("exit", C => {
            this._process.removeAllListeners();
            this._process = null;
            if (this.valOptions.retry && C && C !== 0) this.spawn();
        });

        setImmediate(() => this._eventEmitter.emit("spawn", this._process.pid));

        return this;
    }

    /**
     * Ends the backup process and emits the `exit` event.
     * @returns {BackupManager}
     */
    exit () {
        if (!this._process) throw new Error("Backup process isn't running.");
        this._process.kill("SIGTERM");
        return this;
    }
}

module.exports = BackupManager;


/**
 * Options for a Backup Manager.
 * All integer related options are in milliseconds.
 * @typedef {Object} BackupOptions

 * @param {Boolean} retry Whether or not to retry spawning this Manager's child process if it exits with a non-zero code.

 * @param {String} destination Path to the directory where backups will be placed in.
 * @param {Number} interval A time interval for when copies of the database(s) will be created.
 * @param {Number} snapshots Maximum amount of snapshots to create until making a full backup.
 */

/**
 * Events related to the BackupManager, registered by `manager.on(...);`.
 * @typedef {Events} BackupEvents

 * @param {Timestamp} spawn Fired upon a new child process being created for this Manager.
 * @param {Number} exit Executed with the status code as argument of the function.
 * @param {Error} error Fired when the child process encountered an error.
 * @param {String} debug Any message from the backup process with information about its state.
 */
