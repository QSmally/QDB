#!/usr/bin/env node
"use strict";

const FS        = require("fs");
const Format    = require("./Format");
const Arguments = process.argv.slice(2);

const Menu = require("./Menu");

if (!Arguments.length) {

    const Commands = FS.readdirSync(`${__dirname}/Store/`)
    .map(C => C.split(".")[0]);

    console.log(["QDB Shell\n",
        `${Format.BOLD("USAGE")}\n  qdb <database | make | help> [sub] [params...]\n`,
        `${Format.BOLD("MENU")}\n${Format.LIST(Object.fromEntries(
            Commands.map(Cmd => [Cmd, require(`./Store/${Cmd}`).Description])
        ), 18)}\n`,
        `${Format.BOLD("REPOSITORY")}\n  https://github.com/QSmally/QDB`
    ].join("\n"));

    process.exit(0);

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
