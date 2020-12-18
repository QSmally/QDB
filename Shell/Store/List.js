
const Format = require("../Format");
const SQL    = require("better-sqlite3");

module.exports = {
    Usage: "qdb <database> list",
    Description: "Lists this database's tables with the amount of rows for each table.",
    Examples: [
        "qdb Users.qdb list",
        "qdb ./Internal/Guilds.qdb list"
    ],

    Arguments: 0,

    Execute: Path => {

        const Connection = new SQL(Path);
        
        const Tables = Connection.prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table';").all()
        .map(Row => Row.name).map(Table => [Table, Connection.prepare(`SELECT count(*) FROM '${Table}';`).get()["count(*)"]])
        .map(Entry => [Format.BOLD(Entry[0]), `${Entry[1]} rows`]);

        console.log(`'${Path}' has ${Format.BOLD(Tables.length)} table${Tables.length !== 1 ? "s" : ""}.`);
        console.log(Format.LIST(Object.fromEntries(Tables), 26));
        Connection.close();

        return true;

    }
};
