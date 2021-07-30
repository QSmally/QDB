
const { readdirSync } = require("fs");

const Format = require("./Format");

const commands = new Map(readdirSync(`${__dirname}/Store/`)
    .map(C => [C.split(".")[0].toLowerCase(), require(`./Store/${C}`)])
);

module.exports = (path, arguments) => {
    const command = arguments.shift() || "list";
    const executable = commands.get(command.toLowerCase());

    if (executable) {
        if (arguments.length !== executable.arguments)
            return console.log(`${Format.dim("Error")}: expected ${executable.arguments} arguments, but received ${arguments.length}.`);

        try {
            return executable.execute(path, arguments);
        } catch (error) {
            const issue = `${Format.dim("Error")}: ${error.message}`;
            return console.log(issue);
        }
    }

    console.log([
        `${Format.dim("Error")}: command '${command}' does not exist.`,
        "See a list of commands by invoking 'qdb help [command]'."
    ].join("\n"));
}
