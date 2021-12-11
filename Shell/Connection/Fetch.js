
const Format = require("../Formatter");
const SQL    = require("better-sqlite3");

module.exports = {
    usage: "qdb <database> fetch <name> <identifier>",
    description: "Selects a table to fetch from and retrieves a document.",
    examples: [
        "qdb Users.qdb fetch Users 2ff46929",
        "qdb ./Internal/Guilds.qdb fetch Profiles 396c9b85"
    ],

    arguments: 2,

    execute: (path, arguments) => {
        const connection = new SQL(path);
        const table = arguments.shift();

        const existingTable = connection.prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table' AND name = ?;").get(table);
        if (!existingTable) return console.log(`${Format.dim("Error")}: there's no table with the name '${table}'.`);

        const identifier = arguments.shift();

        const documentObject = connection.prepare(`SELECT Val FROM '${table}' WHERE Key = ?;`).get(identifier);
        if (!documentObject) console.log(`${Format.dim("Error")}: unknown identifier '${identifier}'.`);
        else console.log(JSON.parse(documentObject.Val));

        connection.close();
        return true;
    }
};
