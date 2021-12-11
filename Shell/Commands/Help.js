
const Command   = require("../Command");
const Formatter = require("../Formatter");

const { readdirSync } = require("fs");

class HelpCommand extends Command {

    static name = "help";

    examples = [
        "make Instances.qdb",
        "Development.qdb create Users",
        "Production.qdb vacuum"
    ]

    commands = new Map(readdirSync(`${__dirname}/../Connection/`)
        .map(file => require(`../Connection/${file}`))
        .map(Command => [Command.name, Command])
    );

    get view() {
        let commands = [...this.commands.values()]
            .map(Command => [Command.name, Command.description])
        return Object.fromEntries(commands);
    }

    execute() {
        if (!this.path) return console.log([
            "QDB Shell",

            Formatter.bold("\nUSAGE"),
            "  $ qdb <database | make | help> [command] [parameters...]",

            Formatter.bold("\nCOMMANDS"),
            Formatter.list(this.view, 12),

            Formatter.bold("\nEXAMPLES"),
            this.examples
                .map(example => `  $ qdb ${example}`)
                .join("\n"),

            Formatter.bold("\nREPOSITORY"),
            "  https://github.com/QSmally/QDB"
        ].join("\n"));

        const fetchedCommand = this.commands.get(this.path.toLowerCase());
        if (!fetchedCommand) return console.log(`${Format.dim("Error")}: command '${this.path}' does not exist.`);

        console.log([
            `QDB Shell - ${Formatter.bold(fetchedCommand.name)}`,
            Formatter.dim(fetchedCommand.usage),

            `\n${fetchedCommand.description}`,

            Formatter.bold("\nEXAMPLES"),
            ...fetchedCommand.examples.map(example => `  $ ${example}`)
        ].join("\n"));
    }
}

module.exports = HelpCommand;
