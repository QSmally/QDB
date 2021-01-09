
const Format = require("../Format");
const SQL    = require("better-sqlite3");

module.exports = {
    Usage: "qdb <database> fetch <name> <identifier>",
    Description: "Selects a table to fetch from and retrieves a document.",
    Examples: [
        "qdb Users.qdb fetch Users 123456789012345678",
        "qdb ./Internal/Guilds.qdb fetch Profiles 123456789012345678"
    ],

    Arguments: 2,

    Execute: (Path, Arguments) => {

        const Connection = new SQL(Path);
        const Table = Arguments.shift();
        
        const ExistingTable = Connection.prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table' AND name = ?;").get(Table);
        if (!ExistingTable) return console.log(`${Format.DIM("Error")}: there's no table with the name '${Table}'.`);

        const Identifier = Arguments.shift();

        const Document = Connection.prepare(`SELECT Val FROM '${Table}' WHERE Key = ?;`).get(Identifier);
        if (!Document) console.log(`${Format.DIM("Error")}: unknown identifier '${Identifier}'.`);
        else console.log(JSON.parse(Document.Val));
        
        Connection.close();
        return true;

    }
};
