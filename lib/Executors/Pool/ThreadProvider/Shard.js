
"use strict";

const {
    parentPort: Port,
    workerData: ValOptions
} = require("worker_threads");

Port.on("message", ({
    Methods,
    Parameters
}) => {
    
});
