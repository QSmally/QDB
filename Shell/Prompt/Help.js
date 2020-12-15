
const FS     = require("fs");
const Format = require("../Format");

const Commands = new Map(FS.readdirSync(`${__dirname}/../Store/`)
    .map(C => [C.split(".")[0].toLowerCase(), require(`../Store/${C}`)])
);

module.exports = Command => {
    if (!Command) return console.log(["QDB Shell\n",
        `${Format.BOLD("USAGE")}\n  qdb <database | make | help> [menu] [params...]\n`,
        `${Format.BOLD("MENU")}\n${Format.LIST(Object.fromEntries(
            [...Commands.entries()].map(Entry => [Entry[0], Entry[1].Description])
        ), 18)}\n`,
        `${Format.BOLD("REPOSITORY")}\n  https://github.com/QSmally/QDB`
    ].join("\n"));

    const Sub = Commands.get(Command.toLowerCase());
    if (!Sub) return console.log(`${Format.DIM("Error")}: command '${Command}' does not exist.`);

    console.log([
        `QDB Shell - ${Format.BOLD(Command)}`,
        Format.DIM(Sub.Usage),
        `\n${Sub.Description}\n`,
        Format.BOLD("EXAMPLES"),
        ...Sub.Examples.map(E => `  ${E}`)
    ].join("\n"));
}
