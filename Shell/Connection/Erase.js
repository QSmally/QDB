
const SQL = require("better-sqlite3");

const Command   = require("../Command");
const Formatter = require("../Formatter");

class ConnectionCommand extends Command {

    static name = "erase";
    static usage = "qdb <database> erase <name>";
    static description = "Drops the table given by the name attribute.";

    static examples = [
        "qdb Users.qdb erase Users",
        "qdb ./Internal/Guilds.qdb erase Profiles"
    ];

    static arguments = 1;

    connection = new SQL(this.path);

    execute() {
        const table = this.parameters.shift();

        const existingTable = this.connection
            .prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table' AND name = ?;")
            .get(table);
        if (!existingTable) return console.log(`${Formatter.dim("Error")}: there's no table with the name '${table}'.`);

        this.connection
            .prepare(`DROP TABLE '${table}';`)
            .run();
        console.log(`Successfully erased table '${Formatter.bold(table)}'.`);
        this.connection.close();

        return true;
    }
}

module.exports = ConnectionCommand;
