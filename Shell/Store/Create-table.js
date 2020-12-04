
const Format = require("../Format");
const SQL    = require("better-sqlite3");

module.exports = {
    Input:       true,
    Action:      "create",
    Description: "Creates a table in the given database file.",

    Execute: (Path, Table) => {

        const Connection = new SQL(Path);
        
        const ExistingTable = Connection.prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table' AND name = ?;").get(Table);
        if (ExistingTable) return console.log(`${Format.BOLD("Error")}: another table exists with the name '${Table}'.`);

        Connection.exec(`CREATE TABLE '${Table}' ('Key' VARCHAR PRIMARY KEY, 'Val' TEXT);`);
        console.log(`Successfully created table '${Format.BOLD(Table)}'.`);
        Connection.close();

        return true;

    }
};
