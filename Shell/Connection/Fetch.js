
const SQL = require("better-sqlite3");

const Command   = require("../Command");
const Formatter = require("../Formatter");

class ConnectionCommand extends Command {

    static name = "fetch";
    static usage = "qdb <database> fetch <name> <identifier>";
    static description = "Selects a table to fetch from and retrieves a document.";

    static examples = [
        "qdb Users.qdb fetch Users 2ff46929",
        "qdb ./Internal/Guilds.qdb fetch Profiles 396c9b85"
    ];

    static arguments = 2;

    connection = new SQL(this.path);

    execute() {
        const table = this.parameters.shift();

        const existingTable = this.connection
            .prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table' AND name = ?;")
            .get(table);
        if (!existingTable) return console.log(`${Formatter.dim("Error")}: there's no table with the name '${table}'.`);

        const identifier = this.parameters.shift();

        const documentObject = this.connection
            .prepare(`SELECT Val FROM '${table}' WHERE Key = ?;`)
            .get(identifier);
        if (!documentObject) console.log(`${Formatter.dim("Error")}: unknown identifier '${identifier}'.`);
        else console.log(JSON.parse(documentObject["Val"]));

        this.connection.close();
        return true;
    }
}

module.exports = ConnectionCommand;
