
"use strict";

const BaseConnection = require("./BaseConnection");

const Qulity = require("qulity");
const SQL    = require("better-sqlite3");

class Connection extends BaseConnection {

    /**
     * The main interface for interacting with QDB.
     * @param {Pathlike} PathURL Path to the database file.
     * @param {Object} [rawOptions] Options for this Connection.
     * @param {Pool} [Pool] Pool reference when this database was initialised in a Pool.
     * @example const MyDB = new QDB.Connection("./Databases/Users.db");
     */
    constructor (PathURL, rawOptions = {}, Pool = undefined) {

        super();

        /**
         * Validated options for this Connection.
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
         * @private
         * @readonly
         */
        Object.defineProperty(this, "API", {
            value: new SQL(PahtURL)
        });

        this.Cache = new Qulity.DataStore();

    }

}

module.exports = Connection;
