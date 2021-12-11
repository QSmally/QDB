
const FS     = require("fs");
const Format = require("../Formatter");

const commands = new Map(FS.readdirSync(`${__dirname}/../Connection/`)
    .map(C => [C.split(".")[0].toLowerCase(), require(`../Connection/${C}`)])
);

module.exports = command => {
    if (!command) return console.log(["QDB Shell\n",
        Format.bold("USAGE"),
        "  $ qdb <database | make | help> [command] [parameters...]\n",

        Format.bold("COMMANDS"),
        `${Format.list(Object.fromEntries(
            [...commands.entries()].map(entry => [entry[0], entry[1].description])
        ), 12)}\n`,

        Format.bold("EXAMPLES"),
        `${[
            "make Instances.qdb",
            "Development.qdb create Users",
            "Production.qdb vacuum"
        ].map(E => `  $ qdb ${E}`).join("\n")}\n`,

        Format.bold("REPOSITORY"),
        "  https://github.com/QSmally/QDB"
    ].join("\n"));

    const fetchedCommand = commands.get(command.toLowerCase());
    if (!fetchedCommand) return console.log(`${Format.dim("Error")}: command '${command}' does not exist.`);

    console.log([
        `QDB Shell - ${Format.bold(command)}`,
        Format.dim(fetchedCommand.usage),
        `\n${fetchedCommand.description}\n`,
        Format.BOLD("EXAMPLES"),
        ...fetchedCommand.examples.map(E => `  $ ${E}`)
    ].join("\n"));
}
