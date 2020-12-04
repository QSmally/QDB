
const {Input} = require("enquirer");

module.exports = Action => {
    const Prompt = new Input({
        name:    "Table",
        message: `What is the name of the table you would like to ${Action}?`
    });

    return Prompt;
}
