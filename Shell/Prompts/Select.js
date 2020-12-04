
const FS       = require("fs");
const {Select} = require("enquirer");

const Prompt = new Select({
    name:    "Action",
    message: "Select which action you would like to perform",
    choices: [...FS.readdirSync("Shell/Store/").map(C => C.split(".")[0])]
});

module.exports = Prompt;
