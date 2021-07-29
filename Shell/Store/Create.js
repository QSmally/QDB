
const Format = require("../Format");
const SQL    = require("better-sqlite3");

module.exports = {
    usage: "qdb <database> create <name>",
    description: "Adds an additional table in the given database file.",
    examples: [
        "qdb Users.qdb create Users",
        "qdb ./Internal/Guilds.qdb create Profiles"
    ],

    arguments: 1,

    execute: (path, arguments) => {
        const connection = new SQL(path);
        const table = arguments.shift();
        
        const existingTable = connection.prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table' AND name = ?;").get(table);
        if (existingTable) return console.log(`${Format.dim("Error")}: another table exists with the name '${table}'.`);

        connection.prepare(`CREATE TABLE '${table}' ('Key' VARCHAR PRIMARY KEY, 'Val' TEXT);`).run();
        console.log(`Successfully created table '${Format.bold(table)}'.`);
        connection.close();

        return true;
    }
};
