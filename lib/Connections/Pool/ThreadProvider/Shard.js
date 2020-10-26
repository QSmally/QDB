
"use strict";

const {
    isMainThread,
    parentPort: Port,
    workerData: {Path, Ops}
} = require("worker_threads");

const Connection   = require("../../../Connections/Connection");
// const Instructions = ["ADD", "REMOVE", "QUERY", "RAW", "EXIT"];

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
        if (Instruction == "EXIT") {
            Instances.Disconnect();
            return process.exit(0);
        }

        const Selected = Instances.Select(Identifier);
        if (!Selected) return Port.postMessage(undefined);

        if (Instruction == "RAW") {
            const Output = Selected.API.prepare(Method).get(...Parameters);
            return Port.postMessage(Output);
        }

        const Entry = Selected[Method];
        const Execute = Methods.includes(Method) && Entry instanceof Function;
        return Port.postMessage(Execute ? Selected[Method](...Parameters) : Entry);
    });
}