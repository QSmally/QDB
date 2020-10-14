
"use strict";

const {
    isMainThread,
    parentPort: Port,
    workerData: {Path, Ops}
} = require("worker_threads");

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
