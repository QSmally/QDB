
"use strict";

const {
    isMainThread,
    parentPort: Port,
    workerData: {Path, Ops}
} = require("worker_threads");

const Connection = require("../../../Connections/Connection");

const Methods = Object
.getOwnPropertyNames(Connection.prototype)
.filter(m => m !== "constructor");

if (!isMainThread) {
    const Pool = require("../../../Connections/Pool");
    const Instances = new Pool(Path, Object.assign(Ops, {Threaded: false}));

    Port.on("message", ({
        Instruction,
        Identifier,
        Method,
        Parameters
    }) => {
        // Instructions:
        // add, remove, query, exit
    });
}
