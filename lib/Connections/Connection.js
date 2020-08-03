
"use strict";

const Partial  = require("./PartialConnection");
const Defaults = require("defaults-deep");

const FS     = require("fs");
const Qulity = require("qulity");
const SQL    = require("better-sqlite3");

class Connection {

    /**
     * The main interface for interacting with QDB.
     * @param {Pathlike} PathURL Path to the database file.
     * @param {RawOptions} [RawOptions] Options for this Connection.
     * @param {Pool} [Pool] Pool reference when this database was initialised in a Pool.
     * @example const Users = new QDB.Connection("lib/Databases/Users.qdb");
     * @extends {BaseConnection}
     */
    constructor (PathURL, RawOptions = {}, Pool = undefined) {

        if (FS.existsSync(PathURL)) {

            /**
             * Current state of this Connection.
             * @name Connection#State
             * @type {String}
             * @readonly
             */
            Object.defineProperty(this, "State", {
                enumerable: true,
                writable: true,
                value: "CONNECTED"
            });

            /**
             * Path string to the database.
             * @name Connection#Path
             * @type {Pathlike}
             * @readonly
             */
            Object.defineProperty(this, "Path", {
                enumerable: true,
                value: PathURL
            });

            /**
             * Options for this Connection.
             * @name Connection#ValOptions
             * @type {RawOptions}
             * @readonly
             */
            Object.defineProperty(this, "ValOptions", {
                value: Defaults({
                    Table:  "QDB",
                    Schema: undefined,
                    WAL:    true,

                    Cache:     true,
                    FetchAll:  false,
                    SweepInt:  86400000,
                    SweepLife: 5400000,

                    BackupInt: false,
                    BackupDir: "Backups/"
                }, RawOptions)
            });

            /**
             * Whether this Connection is used in a Pool.
             * @name Connection#Pool
             * @type {Pool|null}
             */
            Object.defineProperty(this, "Pool", {
                enumerable: true,
                value: Pool || null
            });

            /**
             * Table name of this Connection.
             * @name Connection#Table
             * @type {String}
             * @readonly
             */
            Object.defineProperty(this, "Table", {
                value: typeof RawOptions.Table === "undefined" ? "QDB" : RawOptions.Table.toString()
            });

            /**
             * Raw SQL property.
             * @name Connection#API
             * @type {SQL}
             * @private
             * @readonly
             */
            Object.defineProperty(this, "API", {
                value: new SQL(PathURL)
            });

        } else {
            return new Partial();
        }

    }

}

module.exports = Connection;


/**
 * Options for a Connection.
 * @typedef {Object} RawOptions
 * @param {String} Table A name for the table to use at this path.
 * @param {Schema} Schema Link to a database Schema for automatic migration.
 * @param {Boolean} WAL Whether or not to enable Write Ahead Logging mode.
 * @param {Boolean} Cache Whether to enable in-memory caching of entries.
 * @param {Boolean} FetchAll Whether to fetch all database entries on start up.
 * @param {Number|Boolean} SweepInt Integer to indicate at what interval to sweep the cache, or 'false'.
 * @param {Number|Boolean} SweepLife Integer to mark the minimum lifetime of an entry to be swept, or 'false'.
 * @param {Number|Bollean} BackupInt Interval to create a backup of the database, or 'false'.
 * @param {String|Boolean} BackupDir Directory for the backups to be placed in, or 'false'.
 */
