
const FS     = require("fs");
const Format = require("./Format");

const Commands = new Map(FS.readdirSync(`${__dirname}/Store/`)
    .map(C => [C.split(".")[0].toLowerCase(), require(`./Store/${C}`)])
);

module.exports = (Path, Arguments) => {

    const Command    = Arguments.shift() || "list";
    const Executable = Commands.get(Command.toLowerCase());

    if (Executable) {
        if (Arguments.length !== Executable.Arguments)
        return console.log(`${Format.DIM("Error")}: expected ${Executable.Arguments} arguments, but received ${Arguments.length}.`);
        return Executable.Execute(Path, Arguments);
    }

    console.log([
        `${Format.DIM("Error")}: command '${Command}' does not exist.`,
        "See a list of commands by invoking 'qdb help [command]'."
    ].join("\n"));

}
