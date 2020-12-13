
const FS     = require("fs");
const Format = require("./Format");

const Commands = new Map(FS.readdirSync(`${__dirname}/Store/`)
    .map(C => [C.split(".")[0].toLowerCase(), require(`./Store/${C}`)])
);

module.exports = (Path, Arguments) => {

    const Command = Arguments.shift() || "list-tables";

    const Executable = Commands.get(Command.toLowerCase());
    if (Executable) return Executable.Execute(Path, Arguments);

    console.log([
        `${Format.DIM("Error")}: command '${Command}' does not exist.`,
        "See a list of commands with running 'qdb help [command]'."
    ].join("\n"));

}
