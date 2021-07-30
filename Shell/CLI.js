#!/usr/bin/env node
"use strict";

const { existsSync, readdirSync } = require("fs");

const Format    = require("./Format");
const arguments = process.argv.slice(2);

const menu = require("./Menu");
const help = require("./Prompt/Help");

if (!arguments.length) {
    help();
} else {
    const commands = new Map(readdirSync(`${__dirname}/Prompt/`)
        .map(C => [C.split(".")[0].toLowerCase(), require(`./Prompt/${C}`)])
    );

    const action = arguments.shift();
    const executable = commands.get(action.toLowerCase());
    if (executable) return executable(arguments.shift());

    if (!existsSync(action)) return console.log([
        `${Format.dim("Error")}: '${action}' does not exist.`,
        "Use 'qdb make <database>' to create a new database file."
    ].join("\n"));

    menu(action, arguments);
}
