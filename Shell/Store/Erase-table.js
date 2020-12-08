
const Format = require("../Format");
const SQL    = require("better-sqlite3");

module.exports = {
    Input:       true,
    Action:      "delete",
    Description: "Discards the given the table in the database.",

    Execute: (Path, Table) => {

        const Connection = new SQL(Path);
        
        const ExistingTable = Connection.prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table' AND name = ?;").get(Table);
        if (!ExistingTable) return console.log(`${Format.DIM("Error")}: there's no table with the name '${Table}'.`);

        Connection.prepare(`DROP TABLE '${Table}';`).run();
        console.log(`Successfully erased table '${Format.BOLD(Table)}'.`);
        Connection.close();

        return true;

    }
};
