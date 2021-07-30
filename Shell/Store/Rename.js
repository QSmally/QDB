
const Format = require("../Format");
const SQL    = require("better-sqlite3");

module.exports = {
    usage: "qdb <database> rename <name> <new-name>",
    description: "Alters the selected table and renames it to a given string.",
    examples: [
        "qdb Users.qdb rename Users Customers",
        "qdb ./Internal/Guilds.qdb rename Profiles Instances"
    ],

    arguments: 2,

    execute: async (path, arguments) => {
        const connection = new SQL(path);
        const table = arguments.shift();

        const existingTable = connection.prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table' AND name = ?;").get(table);
        if (!existingTable) return console.log(`${Format.dim("Error")}: there's no table with the name '${table}'.`);

        const name = arguments.shift();

        connection.prepare(`ALTER TABLE '${table}' RENAME TO '${name}';`).run();
        console.log(`Successfully renamed table '${table}' to '${Format.bold(name)}'.`);
        connection.close();

        return true;
    }
};
