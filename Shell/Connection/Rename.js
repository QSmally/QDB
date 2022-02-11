
const SQL = require("better-sqlite3");

const Command   = require("../Command");
const Formatter = require("../Formatter");

class ConnectionCommand extends Command {

    static name = "rename";
    static usage = "qdb <database> rename <name> <new-name>";
    static description = "Alters the selected table and renames it to a given string.";

    static examples = [
        "qdb Users.qdb rename Users Customers",
        "qdb ./Internal/Guilds.qdb rename Profiles Instances"
    ];

    static arguments = 2;

    connection = new SQL(this.path);

    execute() {
        const table = this.parameters.shift();

        const existingTable = this.connection
            .prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table' AND name = ?;")
            .get(table);
        if (!existingTable) return console.log(`${Formatter.dim("Error")}: there's no table with the name '${table}'.`);

        const name = this.parameters.shift();

        this.connection
            .prepare(`ALTER TABLE '${table}' RENAME TO '${name}';`)
            .run();
        console.log(`Successfully renamed table '${table}' to '${Formatter.bold(name)}'.`);
        this.connection.close();

        return true;
    }
}

module.exports = ConnectionCommand;
