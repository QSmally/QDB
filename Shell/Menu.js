
module.exports = async Path => {

    const Selected = await require("./Prompts/Select").run().catch(_ => process.exit(0));
    const Command  = require(`./Store/${Selected}`);
    const Table    = Command.Input ? await require("./Prompts/Table")(`Table to ${Command.Action}`).catch(_ => process.exit(0)) : null;

    return Command.Execute(Path, Table);

}
