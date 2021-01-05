
"use strict";

const FS    = require("fs");
const Path  = require("path");
const Child = require("child_process");

class BackupManager {

    /**
     * A utility class for creating backups of databases.
     * @param {Pathlike} PathURL Path to the database file or directory to backup.
     * @param {BackupOptions} BackupOptions Options to use for this Backup Manager.
     * @example new QDB.BackupManager("lib/Databases/", { Destination: "/usr/local/backups/" });
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


        const Process = Child.fork(Path.join(__dirname, "Process.js"), {
            env: {PathURL, ...this.ValOptions}
        });

        /**
         * The child process that manages the backups.
         * @name BackupManager#Process
         * @type {Process}
         * @private
         */
        Object.defineProperty(this, "Process", {
            value: Process
        });

    }

}

module.exports = BackupManager;


/**
 * Options for a Backup Manager.
 * All integer related options are in milliseconds.
 * @typedef {Object} BackupOptions

 * @param {String} Destination Path to the directory where backups will be placed in.
 * @param {Number} Interval A time interval for when copies of the database(s) will be created.
 * @param {Number} Snapshots Maximum amount of snapshots to create until making a full backup.
 */
