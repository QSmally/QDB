
const Format = require("../Format");
const SQL    = require("better-sqlite3");

module.exports = {
    Input:       false,
    Action:      "list",
    Description: "Lists all the tables in this database file.",

    Execute: Path => {

        const Connection = new SQL(Path);
        
        const Tables = Connection.prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table';").all()
        .map(Row => Row.name).map(Table => [Table, Connection.prepare(`SELECT count(*) FROM '${Table}';`).get()["count(*)"]])
        .map(Entry => [Format.BOLD(Entry[0]), `${Entry[1]} rows`]);

        console.log(Format.LIST(Object.fromEntries(Tables), 26));
        Connection.close();

        return true;

    }
};
