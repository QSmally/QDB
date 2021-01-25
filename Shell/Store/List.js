
const FS     = require("fs");
const Format = require("../Format");
const SQL    = require("better-sqlite3");

module.exports = {
    Usage: "qdb <database> list",
    Description: "Lists this database's statistics together with the tables.",
    Examples: [
        "qdb Users.qdb list",
        "qdb /etc/databases/Service.qdb list",
        "qdb ./Internal/Guilds.qdb list"
    ],

    Arguments: 0,

    Execute: Path => {

        const Connection = new SQL(Path);
        
        const Tables = Connection.prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table';").all()
        .map(Row => Row.name).map(Table => [Table, Connection.prepare(`SELECT count(*) FROM '${Table}';`).get()["count(*)"]])
        .map(Entry => [Format.BOLD(Entry[0]), `${Entry[1]} rows`]);

        const Size  = FS.lstatSync(Path).size;
        const Units = ["bytes", "KiB", "MiB", "GiB", "TiB", "PiB"];
        const Idx   = Size !== 0 ? Math.floor(Math.log(Size) / Math.log(1024)) : 0;

        console.log([
            Format.DIM(Path),
            `Size: ${Format.BOLD(`${Math.round(Size / Math.pow(1024, Idx))} ${Units[Idx]}`)}`,
            `Tables: ${Format.BOLD(Tables.length)}\n`,
            Format.LIST(Object.fromEntries(Tables), 26, true)
        ].join("\n"));
        
        Connection.close();
        return true;

    }
};
