
"use strict";

const FS   = require("fs");
const Path = require("path");

const {
    pathURL, destination, interval, snapshots
} = process.env;

let snapshotIdx = 0;


function backup (resolvedPath, isDirectory) {
    const endpointPath = Path.join(resolvedPath, new Date().toISOString());

    if (isDirectory) {
        FS.mkdirSync(endpointPath);
        FS.readdirSync(pathURL).forEach(database => {
            const source = Path.join(pathURL, database);
            const destination = Path.join(endpointPath, database);
            FS.copyFile(source, destination, () => {});
        });
    } else {
        const destination = `${endpointPath}.qdb`;
        FS.copyFile(pathURL, destination, () => {});
    }

    return endpointPath;
}

function pathfinder () {
    const databaseHostName = pathURL
        .split("/")
        .filter(A => !!A)
        .pop()
        .split(".")[0];

    const isDirectory        = FS.lstatSync(pathURL).isDirectory();
    const middleware         = snapshotIdx < snapshots ? "Snapshots" : "";
    const resolvedBackupPath = Path.resolve(destination, middleware, databaseHostName);

    snapshotIdx = snapshotIdx < snapshots ?
        (snapshotIdx + 1) :
        0;

    !FS.existsSync(resolvedBackupPath) ?
        FS.mkdir(resolvedBackupPath, { recursive: true }, () => backup(resolvedBackupPath, isDirectory)) :
        backup(resolvedBackupPath, isDirectory);
}

setInterval(() => {
    !FS.existsSync(destination) ?
        FS.mkdir(destination, { recursive: true }, pathfinder) :
        pathfinder();
}, interval);
