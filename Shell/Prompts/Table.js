
const {Input} = require("enquirer");

module.exports = Action => {
    const Prompt = new Input({
        message: Action,
        name: "Table"
    });

    return Prompt.run();
}
