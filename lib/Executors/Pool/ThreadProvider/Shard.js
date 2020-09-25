
"use strict";

const {
    parentPort: Port,
    workerData: {Path, Ops}
} = require("worker_threads");

const Pool = require("../../../Connections/Pool");

const Databases = new Pool(Path, Object.assign(Ops, {
    Threads: false
}));


Port.on("message", ({
    Methods,
    Parameters
}) => {
    
});
