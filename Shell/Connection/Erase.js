
const Format = require("../Formatter");
const SQL    = require("better-sqlite3");

module.exports = {
    usage: "qdb <database> erase <name>",
    description: "Drops the table given by the name attribute.",
    examples: [
        "qdb Users.qdb erase Users",
        "qdb ./Internal/Guilds.qdb erase Profiles"
    ],

    arguments: 1,

    execute: (path, arguments) => {
        const connection = new SQL(path);
        const table = arguments.shift();

        const existingTable = connection.prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table' AND name = ?;").get(table);
        if (!existingTable) return console.log(`${Format.dim("Error")}: there's no table with the name '${table}'.`);

        connection.prepare(`DROP TABLE '${table}';`).run();
        console.log(`Successfully erased table '${Format.bold(table)}'.`);
        connection.close();

        return true;
    }
};
