#!/usr/bin/env node
"use strict";

const FS        = require("fs");
const Format    = require("./Format");
const Arguments = process.argv.slice(2);

const Menu = require("./Menu");
const Help = require("./Prompt/Help");

if (!Arguments.length) {
    Help();
} else {

    const Commands = new Map(FS.readdirSync(`${__dirname}/Prompt/`)
        .map(C => [C.split(".")[0].toLowerCase(), require(`./Prompt/${C}`)])
    );
    
    console.log(Arguments);

    const Action = Arguments.shift();
    const Executable = Commands.get(Action.toLowerCase());
    if (Executable) return Executable(Arguments.shift());
    

    if (!FS.existsSync(Action)) return console.log([
        `${Format.DIM("Error")}: '${Action}' does not exist.`,
        "Use 'qdb make <database>' to create a new QDB instance."
    ].join("\n"));

    Menu(Action, Arguments);

}
