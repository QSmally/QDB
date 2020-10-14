
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

        const Selected = Instances.$(Identifier);
        if (!Selected) return Port.postMessage(undefined);
        
        // if (!Methods.includes(Method)) return Port.postMessage(Selected[Method]);
        // else return Port.postMessage(Selected[Method](...Parameters));

        return Port.postMessage(Methods.includes(Method) ?
            Selected[Method](...Parameters) :
            Selected[Method]
        );
    });
}
