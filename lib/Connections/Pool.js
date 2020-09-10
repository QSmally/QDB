
"use strict";

const Connection = require("./Connection");

const FS     = require("fs");
const Qulity = require("qulity");

class Pool {

    /**
     * A utility class for managing multiple database Connections.
     * @param {Pathlike} PathURL Path to the database file or directory.
     * @param {PoolOptions} [PoolOptions] Options for this Pool to manage, including exclusive Connection options.
     * @param {RawOptions} [RawOptions] Options to pass onto every database Connection.
     * @example const MyDBs = new QDB.Pool("lib/Databases/");
     */
    constructor (PathURL, PoolOptions = {}, RawOptions = {}) {

    }

}

module.exports = Pool;
