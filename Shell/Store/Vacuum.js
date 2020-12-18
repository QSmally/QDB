
const FS     = require("fs");
const Format = require("../Format");
const SQL    = require("better-sqlite3");

module.exports = {
    Usage: "qdb <database> vacuum",
    Description: "Rebuilds this database, repacking it into a minimal amount of disk space.",
    Examples: [
        "qdb Guilds.qdb vacuum",
    ],

    Arguments: 0,

    Execute: Path => {

        const Connection = new SQL(Path);
        const Size = FS.lstatSync(Path).size;

        process.stdout.write("Repacking database file... ");
        Connection.prepare("VACUUM;").run();
        Connection.close();

        const RepackedSize = Math.round((Size - FS.lstatSync(Path).size) / 1024 / 1024);
        console.log(`Successfully reclaimed ${Format.BOLD(RepackedSize)} MB of disk space.`);
        return true;

    }
};
