
const FS       = require("fs");
const {Select} = require("enquirer");

const Prompt = new Select({
    name:    "Action",
    message: "Select an action",
    choices: [...FS.readdirSync(__dirname + "/../Store/").map(C => C.split(".")[0])]
});

module.exports = Prompt;
