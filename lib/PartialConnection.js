
"use strict";

const Connection     = require("./Connection");
const BaseConnection = require("./BaseConnection");

const FS = require("fs");

class PartialConnection extends BaseConnection {

    /**
     * Instantiates an idle connection.
     * @example this.Database = new QDB.PartialConnection();
     * @extends {BaseConnection}
     */
    constructor () {
        super();
        this.State = "PARTIAL";
    }


    /**
     * Reconnects to a database path.
     * @param {Pathlike} PathURL Path to the database file.
     * @param {Object} [Options] Options to pass onto the database.
     * @returns {Connection|PartialConnection}
     */
    Resume (PathURL, Options = {}) {
        if (FS.existsSync(PathURL)) {
            this.State = "RECONNECTING";
            return new Connection(PathURL, Options);
        } else return this;
    }

}

module.exports = PartialConnection;
