
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
        if (Identifier === "__ThreadExit") {
            Databases.Disconnect();
            return process.exit(0);
        }

        const Store = Databases.$(Identifier);
        if (!Store) Port.postMessage(undefined);

        Port.postMessage(typeof Store[Method] === "undefined" ?
            undefined : typeof Store[Method] === "function" ?
            Store[Method](...Parameters) : Store[Method]
        );
    });
}
