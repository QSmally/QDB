
"use strict";

const Child = require("child_process");

const FS     = require("fs");
const Path   = require("path");
const Events = require("events");

class BackupManager {

    /**
     * A utility class for creating backups of databases.
     * @param {Pathlike} PathURL Path to the database file or directory to backup.
     * @param {BackupOptions} BackupOptions Options to use for this Backup Manager.
     * @example new QDB.BackupManager("lib/Databases/", { Destination: "/usr/local/backups/" });
     * @extends {EventEmitter}
     */
    constructor (PathURL, BackupOptions = {}) {

        if (FS.existsSync(PathURL)) {

            /**
             * Path string to a directory or database file.
             * @name BackupManager#Path
             * @type {Pathlike}
             * @readonly
             */
            Object.defineProperty(this, "Path", {
                enumerable: true,
                value: PathURL
            });

            /**
             * Options for this Manager.
             * @name BackupManager#ValOptions
             * @type {BackupOptions}
             * @private
             */
            Object.defineProperty(this, "ValOptions", {
                value: {
                    Retry: true,

                    Destination: "Backup/",
                    Interval:    3600000,
                    Snapshots:   24,

                    ...BackupOptions
                }
            });

            /**
             * Path string to the destination of the backups.
             * @name BackupManager#Destination
             * @type {Pathlike}
             * @readonly
             */
            Object.defineProperty(this, "Destination", {
                enumerable: true,
                value: this.ValOptions.Destination
            });

        } else {
            throw new Error("Source directory or database file does not exist.");
        }


        /**
         * The child process that manages the backups.
         * @name BackupManager#_Process
         * @type {Process?}
         * @private
         */
        Object.defineProperty(this, "_Process", {
            writable: true,
            value: null
        });

        /**
         * This manager's event manager to control
         * the information of the backup child process.
         * @name BackupManager#_EventEmitter
         * @type {EventEmitter}
         * @private
         */
        Object.defineProperty(this, "_EventEmitter", {
            value: new Events()
        });

        this.Spawn();

    }


    /**
     * Registers an event listener on one of this Manager's events.
     * @param {String} Event Which action to register for the listener.
     * @param {Function} Listener Function to execute upon this event.
     * @returns {BackupManager}
     */
    On (Event, Listener) {
        this._EventEmitter.on(Event, Listener);
        return this;
    }

    /**
     * Spawns the child processor for this Manager.
     * @returns {BackupManager}
     */
    Spawn () {
        if (this._Process) throw new Error("Child process exists for this Manager.");

        this._Process = Child.fork(Path.join(__dirname, "Process.js"), {
            env: {PathURL: this.Path, ...this.ValOptions}
        });

        this._Process
        .on("exit",    C => this._EventEmitter.emit("Exit", C))
        .on("error",   E => this._EventEmitter.emit("Error", E))
        .on("message", M => this._EventEmitter.emit("Debug", M));

        this._Process.on("exit", C => {
            this._Process.removeAllListeners();
            this._Process = null;
            if (this.ValOptions.Retry && C && C !== 0) this.Spawn();
        });

        setImmediate(() => this._EventEmitter.emit("Spawn", this._Process.pid));

        return this;
    }

    /**
     * Ends the backup process and emits the `Exit` event.
     * @returns {BackupManager}
     */
    Exit () {
        if (!this._Process) throw new Error("Backup process isn't running.");
        this._Process.kill("SIGTERM");
        return this;
    }

}

module.exports = BackupManager;


/**
 * Options for a Backup Manager.
 * All integer related options are in milliseconds.
 * @typedef {Object} BackupOptions

 * @param {Boolean} Retry Whether or not to retry spawning this Manager's child process if it exits with a non-zero code.

 * @param {String} Destination Path to the directory where backups will be placed in.
 * @param {Number} Interval A time interval for when copies of the database(s) will be created.
 * @param {Number} Snapshots Maximum amount of snapshots to create until making a full backup.
 */

/**
 * Events related to the BackupManager, registered by `Manager.On(...);`.
 * @typedef {Events} BackupEvents

 * @param {Timestamp} Spawn Fired upon a new child process being created for this Manager.
 * @param {Number} Exit Executed with the status code as argument of the function.
 * @param {Error} Error Fired when the child process encountered an error.
 * @param {String} Debug Any message from the backup process with information about its state.
 */
