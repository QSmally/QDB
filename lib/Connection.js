
"use strict";

const BaseConnection = require("./BaseConnection");

const FS     = require("fs");
const Qulity = require("qulity");
const SQL    = require("better-sqlite3");

class Connection extends BaseConnection {

    /**
     * The main interface for interacting with QDB.
     * @param {Pathlike} PathURL Path to the database file.
     * @param {Object} [rawOptions] Options for this Connection.
     * @param {Pool} [Pool] Pool reference when this database was initialised in a Pool.
     * @example const MyDB = new QDB.Connection("./Databases/Users.db");
     * @extends {BaseConnection}
     */
    constructor (PathURL, rawOptions = {}, Pool = undefined) {

        if (FS.existsSync(PathURL)) {

            super();

            this.Path  = PathURL;
            this.State = "CONNECTED";

            /**
             * Validated options for this Connection.
             * @name Connection#valOptions
             * @type {Object}
             * @private
             * @readonly
             */
            Object.defineProperty(this, "valOptions", {
                value: {
                    FetchAll:      rawOptions.FetchAll || false,
                    SweepInterval: rawOptions.SweepInterval || 86400000,
                    Backups:       rawOptions.Backups || false
                }
            });
    
            /**
             * Raw SQL property.
             * @name Connection#API
             * @type {SQL}
             * @private
             * @readonly
             */
            Object.defineProperty(this, "API", {
                value: new SQL(PahtURL)
            });
    
            /**
             * In-memory cached tables.
             * @name Connection#Cache
             * @type {DataStore}
             * @private
             * @readonly
             */
            Object.defineProperty(this, "Cache", {
                value: new Qulity.DataStore()
            });

        } else {
            const PartialConnection = require("./PartialConnection");
            return new PartialConnection();
        }

    }

}

module.exports = Connection;
