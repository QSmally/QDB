#!/usr/bin/env node
"use strict";

const { existsSync, readdirSync } = require("fs");

const Format = require("./Format");
const toolArguments = process.argv.slice(2);

const menu = require("./Menu");
const help = require("./Prompt/Help");

if (!toolArguments.length) {
    help();
} else {
    const commands = new Map(readdirSync(`${__dirname}/Prompt/`)
        .map(C => [C.split(".")[0].toLowerCase(), require(`./Prompt/${C}`)])
    );

    const action = toolArguments.shift();
    const executable = commands.get(action.toLowerCase());
    if (executable) return executable(toolArguments.shift());

    if (!existsSync(action)) return console.log([
        `${Format.dim("Error")}: '${action}' does not exist.`,
        "Use 'qdb make <database>' to create a new database file."
    ].join("\n"));

    menu(action, toolArguments);
}
