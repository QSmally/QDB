
const SQL = require("better-sqlite3");

const Command   = require("../Command");
const Formatter = require("../Formatter");

const { lstatSync } = require("fs");

class ConnectionCommand extends Command {

    static name = "list";
    static usage = "qdb <database> list";
    static description = "Lists this database's statistics together with the tables.";

    static examples = [
        "qdb Users.qdb list",
        "qdb /etc/databases/Service.qdb list",
        "qdb ./Internal/Guilds.qdb list"
    ];

    static arguments = 0;
    static units = ["bytes", "KiB", "MiB", "GiB", "TiB", "PiB"];

    connection = new SQL(this.path);

    execute() {
        const tables = this.connection
            .prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table';")
            .all()
            .map(row => row.name)
            .map(table => [table, this.connection.prepare(`SELECT COUNT(*) FROM '${table}';`).get()["COUNT(*)"]])
            .map(entry => [Formatter.bold(entry[0]), `${entry[1]} rows`]);

        const { size } = lstatSync(this.path);
        const index = size > 0 ?
            Math.floor(Math.log(size) / Math.log(1024)) :
            0;

        console.log([
            `Label:  ${Formatter.dim(this.path)}`,
            `Size:   ${Formatter.bold(`${Math.round(size / Math.pow(1024, index))} ${ConnectionCommand.units[index]}`)}`,
            `Tables: ${Formatter.bold(tables.length)}\n`,
            Formatter.list(Object.fromEntries(tables), 26, true)
        ].join("\n"));

        this.connection.close();
        return true;
    }
}

module.exports = ConnectionCommand;
