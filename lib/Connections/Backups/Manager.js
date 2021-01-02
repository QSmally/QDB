
"use strict";

const FS = require("fs");

class BackupManager {

    /**
     * A utility class for creating backups of databases.
     * @param {Pathlike} PathURL Path to the database file or directory to backup.
     * @param {RawOptions|Pathlike} OptionsOrDest The destination for the backups of the database(s).
     * @example new QDB.BackupManager("lib/Databases/", "/usr/local/backups/");
     */
    constructor (PathURL, OptionsOrDest) {

        if (FS.existsSync(PathURL)) {

            const RawOptions = typeof OptionsOrDest === "string" ? {} : OptionsOrDest;

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
             * @type {RawOptions}
             * @private
             */
            Object.defineProperty(this, "ValOptions", {
                value: {
                    Destination: "Backup/",

                    Interval:    86400000,
                    SnapshotInt: 10800000,
                    SnapshotLtm: 10,

                    ...RawOptions
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
                value: typeof OptionsOrDest === "string" ?
                    OptionsOrDest : this.ValOptions.Destination
            });

        } else {
            throw new Error("Source directory or database file does not exist.");
        }

    }

}

module.exports = BackupManager;
