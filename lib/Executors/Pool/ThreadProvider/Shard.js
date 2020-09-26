
"use strict";

const {
    isMainThread,
    parentPort: Port,
    workerData: {Path, Ops}
} = require("worker_threads");

const Pool = require("../../../Connections/Pool");

if (!isMainThread) {
    const Databases = new Pool(Path,
        Object.assign(Ops, {Threaded: false}
    ));

    Port.on("message", ({
        Identifier,
        Method,
        Parameters
    }) => {
        const Store = Databases.$(Identifier);
        if (!Store || !Store[Method]) return undefined;
        return Store[Method](...Parameters);
    });
}
