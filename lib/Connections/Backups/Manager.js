
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
                    Respawn: true,

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
            value: null
        });

        /**
         * This manager's event manager to control
         * the flow of the backup child process.
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
            this._Process = null;
            if (this.ValOptions.Respawn && C !== 0)
            return this.Spawn();
        });

        this._EventEmitter.emit("Spawn", Date.now());

        return this;
    }

}

module.exports = BackupManager;


/**
 * Options for a Backup Manager.
 * All integer related options are in milliseconds.
 * @typedef {Object} BackupOptions

 * @param {Boolean} Respawn Whether or not to retry spawning this Manager's child process if it exits with a non-zero code.

 * @param {String} Destination Path to the directory where backups will be placed in.
 * @param {Number} Interval A time interval for when copies of the database(s) will be created.
 * @param {Number} Snapshots Maximum amount of snapshots to create until making a full backup.
 */
