
const FS     = require("fs");
const Format = require("../Formatter");
const SQL    = require("better-sqlite3");

module.exports = {
    usage: "qdb <database> vacuum",
    description: "Rebuilds this database, repacking it into a minimal amount of disk space.",
    examples: [
        "qdb Guilds.qdb vacuum",
    ],

    arguments: 0,

    execute: path => {
        const connection = new SQL(path);
        const size = FS.lstatSync(path).size;

        process.stdout.write("Repacking database file... ");
        connection.prepare("VACUUM;").run();
        connection.close();

        const repackedSize = size - FS.lstatSync(path).size;
        const units        = ["bytes", "KiB", "MiB", "GiB", "TiB", "PiB"];
        const idx          = repackedSize !== 0 ? Math.floor(Math.log(repackedSize) / Math.log(1024)) : 0;

        console.log(`Successfully reclaimed ${Format.bold(`${Math.round(repackedSize / Math.pow(1024, idx))} ${units[idx]}`)} of disk space.`);
        return true;
    }
};
