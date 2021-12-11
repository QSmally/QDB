
const SQL = require("better-sqlite3");

const Command   = require("../Command");
const Formatter = require("../Formatter");

class ConnectionCommand extends Command {

    static name = "create";
    static usage = "qdb <database> create <name>";
    static description = "Adds an additional table in the given database file.";

    static examples = [
        "qdb Users.qdb create Users",
        "qdb ./Internal/Guilds.qdb create Profiles"
    ];

    static arguments = 1;

    connection = new SQL(this.path);

    execute() {
        const table = this.parameters.shift();

        const existingTable = this.connection
            .prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table' AND name = ?;")
            .get(table);
        if (existingTable) return console.log(`${Formatter.dim("Error")}: another table exists with the name '${table}'.`);

        this.connection
            .prepare(`CREATE TABLE '${table}' ('Key' VARCHAR PRIMARY KEY, 'Val' TEXT);`)
            .run();
        console.log(`Successfully created table '${Formatter.bold(table)}'.`);
        this.connection.close();

        return true;
    }
}

module.exports = ConnectionCommand;
