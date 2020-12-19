
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

        const RepackedSize = Size - FS.lstatSync(Path).size;
        const Units        = ["bytes", "KiB", "MiB", "GiB", "TiB", "PiB"];
        const Idx          = RepackedSize !== 0 ? Math.floor(Math.log(RepackedSize) / Math.log(1024)) : 0;

        console.log(`Successfully reclaimed ${Format.BOLD(`${Math.round(RepackedSize / Math.pow(1024, Idx))} ${Units[Idx]}`)} of disk space.`);
        return true;

    }
};
