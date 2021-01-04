
"use strict";

const FS = require("fs");

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

                    Interval:    86400000,
                    SnapshotInt: 10800000,
                    SnapshotLtm: 10,

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

    }

}

module.exports = BackupManager;
