
const SQL = require("better-sqlite3");

const Command   = require("../Command");
const Formatter = require("../Formatter");

const { lstatSync } = require("fs");

class ConnectionCommand extends Command {

    static name = "vacuum";
    static usage = "qdb <database> vacuum";
    static description = "Rebuilds this database, repacking it into a minimal amount of disk space.";

    static examples = [
        "qdb Guilds.qdb vacuum",
    ];

    static arguments = 0;
    static units = ["bytes", "KiB", "MiB", "GiB", "TiB", "PiB"];

    connection = new SQL(this.path);

    execute() {
        const { size } = lstatSync(this.path);

        process.stdout.write("Repacking database file... ");
        this.connection.prepare("VACUUM;").run();
        this.connection.close();

        const { size: newSize } = lstatSync(this.path);
        const repackedSize = size - newSize;

        const index = repackedSize > 0 ?
            Math.floor(Math.log(repackedSize) / Math.log(1024)) :
            0;

        console.log(`Successfully reclaimed ${Formatter.bold(`${Math.round(repackedSize / Math.pow(1024, index))} ${ConnectionCommand.units[index]}`)} of disk space.`);
        return true;
    }
}

module.exports = ConnectionCommand;
