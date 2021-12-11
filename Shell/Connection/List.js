
const FS     = require("fs");
const Format = require("../Formatter");
const SQL    = require("better-sqlite3");

module.exports = {
    usage: "qdb <database> list",
    description: "Lists this database's statistics together with the tables.",
    examples: [
        "qdb Users.qdb list",
        "qdb /etc/databases/Service.qdb list",
        "qdb ./Internal/Guilds.qdb list"
    ],

    arguments: 0,

    execute: path => {
        const connection = new SQL(path);

        const tables = connection
            .prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table';")
            .all()
            .map(row => row.name)
            .map(table => [table, connection.prepare(`SELECT COUNT(*) FROM '${table}';`).get()["COUNT(*)"]])
            .map(entry => [Format.bold(entry[0]), `${entry[1]} rows`]);

        const size  = FS.lstatSync(path).size;
        const units = ["bytes", "KiB", "MiB", "GiB", "TiB", "PiB"];
        const idx   = size !== 0 ? Math.floor(Math.log(size) / Math.log(1024)) : 0;

        console.log([
            Format.dim(path),
            `Size: ${Format.bold(`${Math.round(size / Math.pow(1024, idx))} ${units[idx]}`)}`,
            `Tables: ${Format.bold(tables.length)}\n`,
            Format.list(Object.fromEntries(tables), 26, true)
        ].join("\n"));

        connection.close();
        return true;
    }
};
