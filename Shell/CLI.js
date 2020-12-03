#!/usr/bin/env node
"use strict";

const Format    = require("./Format");
const Arguments = process.argv.slice(2);

if (!Arguments.length) {
    
    const FS = require("fs");
    const Commands = FS.readdirSync("Shell/Store/")
    .map(C => C.split(".")[0].toLowerCase());

    console.log(["QDB Shell\n",
        `${Format.BOLD("USAGE")}\n  qdb <database> [\"make\" | flags]\n`,
        `${Format.BOLD("MENU")}\n  ${Format.LIST(Object.fromEntries(
            Commands.map(Cmd => [Cmd, require(`./Store/${Cmd}`).Description])
        ))}\n`,
        `${Format.BOLD("REPOSITORY")}\n  https://github.com/QSmally/QDB`
    ].join("\n"));

} else {}
