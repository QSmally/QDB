
module.exports = async Path => {

    const Selected = await require("./Prompts/Select").run();
    const Command  = require(`./Store/${Selected}`);
    const Table    = Command.Input ? await require("./Prompts/Table").run() : null;

    return Command.Execute(Path, Table);

}
