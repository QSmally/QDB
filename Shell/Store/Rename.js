
const Format = require("../Format");
const SQL    = require("better-sqlite3");

module.exports = {
    Usage: "qdb <database> rename <name> <new-name>",
    Description: "Alters the selected table and renames it to a given string.",
    Examples: [
        "qdb Users.qdb rename Users Customers",
        "qdb ./Internal/Guilds.qdb rename Profiles Instances"
    ],

    Arguments: 2,

    Execute: async (Path, Arguments) => {

        const Connection = new SQL(Path);
        const Table = Arguments.shift();
        
        const ExistingTable = Connection.prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table' AND name = ?;").get(Table);
        if (!ExistingTable) return console.log(`${Format.DIM("Error")}: there's no table with the name '${Table}'.`);

        const Name = Arguments.shift();

        Connection.prepare(`ALTER TABLE '${Table}' RENAME TO '${Name}';`).run();
        console.log(`Successfully renamed table '${Table}' to '${Format.BOLD(Name)}'.`);
        Connection.close();

        return true;

    }
};
