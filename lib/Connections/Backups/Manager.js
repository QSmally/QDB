
"use strict";

const FS = require("fs");

class BackupManager {

    /**
     * A utility class for creating backups of databases.
     * @param {Pathlike} PathURL Path to the database file or directory to backup.
     * @example new QDB.BackupManager("lib/Databases/");
     */
    constructor (PathURL, Destination) {

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

        } else {
            throw new Error("Source directory or database file does not exist.");
        }

    }

}

module.exports = BackupManager;
