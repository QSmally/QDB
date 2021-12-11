
const Command   = require("../Command");
const Formatter = require("../Formatter");

const { existsSync, appendFileSync } = require("fs");

class MakeCommand extends Command {

    static name = "make";

    static examples = [
        "Users.qdb",
        "./Cellar/Guilds.qdb",
        "/opt/xyz/Service.qdb"
    ];

    execute() {
        if (!this.path) return console.log([
            `QDB Shell - ${Formatter.bold(fetchedCommand.name)}`,
            "qdb make <database>",

            `\nMakes a new, QDB-formatted database file at the given path.`,

            Formatter.bold("\nEXAMPLES"),
            ...MakeCommand.examples.map(example => `  $ qdb make ${example}`)
        ].join("\n"));

        if (existsSync(this.path)) return console.log(
            `${Formatter.dim("Error")}: file '${this.path}' already exists.`
        );

        appendFileSync(this.path, "");
        console.log(`${Formatter.dim("Success")}: database file '${this.path}' has been created.`);
    }
}

module.exports = MakeCommand;
