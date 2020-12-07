
const Format = require("../Format");
const SQL    = require("better-sqlite3");
const Prompt = require("../Prompts/Table");

module.exports = {
    Input:       true,
    Action:      "rename",
    Description: "Alters the selected table and renames it to a given string.",

    Execute: async (Path, Table) => {

        const Connection = new SQL(Path);
        
        const ExistingTable = Connection.prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table' AND name = ?;").get(Table);
        if (!ExistingTable) return console.log(`${Format.DIM("Error")}: there's no table with the name '${Table}'.`);

        const Name = await Prompt("New name").catch(_ => process.exit(0));

        Connection.exec(`ALTER TABLE '${Table}' RENAME TO '${Name}';`);
        console.log(`Successfully renamed table '${Table}' to '${Format.BOLD(Name)}'.`);
        Connection.close();

        return true;

    }
};
