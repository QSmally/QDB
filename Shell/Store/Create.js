
const Format = require("../Format");
const SQL    = require("better-sqlite3");

module.exports = {
    Usage: "qdb <database> create <name>",
    Description: "Adds an additional table in the given database file.",
    Examples: [
        "qdb Users.qdb create Users",
        "qdb ./Internal/Guilds.qdb create Profiles"
    ],

    Execute: (Path, Arguments) => {

        const Connection = new SQL(Path);
        const Table = Arguments.shift();
        
        const ExistingTable = Connection.prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table' AND name = ?;").get(Table);
        if (ExistingTable) return console.log(`${Format.DIM("Error")}: another table exists with the name '${Table}'.`);

        Connection.prepare(`CREATE TABLE '${Table}' ('Key' VARCHAR PRIMARY KEY, 'Val' TEXT);`).run();
        console.log(`Successfully created table '${Format.BOLD(Table)}'.`);
        Connection.close();

        return true;

    }
};
