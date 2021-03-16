
const FS     = require("fs");
const Format = require("../Format");

const Commands = new Map(FS.readdirSync(`${__dirname}/../Store/`)
    .map(C => [C.split(".")[0].toLowerCase(), require(`../Store/${C}`)])
);

module.exports = Command => {
    if (!Command) return console.log(["QDB Shell\n",
        Format.BOLD("USAGE"),
        "  $ qdb <database | make | help> [command] [parameters...]\n",

        Format.BOLD("COMMANDS"),
        `${Format.LIST(Object.fromEntries(
            [...Commands.entries()].map(Entry => [Entry[0], Entry[1].Description])
        ), 12)}\n`,

        Format.BOLD("EXAMPLES"),
        `${[
            "make Instances.qdb",
            "Development.qdb create Users",
            "Production.qdb vacuum"
        ].map(E => `  $ qdb ${E}`).join("\n")}\n`,

        Format.BOLD("REPOSITORY"),
        "  https://github.com/QSmally/QDB"
    ].join("\n"));

    const Fetched = Commands.get(Command.toLowerCase());
    if (!Fetched) return console.log(`${Format.DIM("Error")}: command '${Command}' does not exist.`);

    console.log([
        `QDB Shell - ${Format.BOLD(Command)}`,
        Format.DIM(Fetched.Usage),
        `\n${Fetched.Description}\n`,
        Format.BOLD("EXAMPLES"),
        ...Fetched.Examples.map(E => `  $ ${E}`)
    ].join("\n"));
}
