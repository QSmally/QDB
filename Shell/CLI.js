#!/usr/bin/env node
"use strict";

const FS        = require("fs");
const Format    = require("./Format");
const Arguments = process.argv.slice(2);

if (!Arguments.length) {

    const Commands = FS.readdirSync("Shell/Store/")
    .map(C => C.split(".")[0].toLowerCase());

    console.log(["QDB Shell\n",
        `${Format.BOLD("USAGE")}\n  qdb <database> [\"make\" | flags]\n`,
        `${Format.BOLD("MENU")}\n  ${Format.LIST(Object.fromEntries(
            Commands.map(Cmd => [Cmd, require(`./Store/${Cmd}`).Description])
        ))}\n`,
        `${Format.BOLD("REPOSITORY")}\n  https://github.com/QSmally/QDB`
    ].join("\n"));

    process.exit(0);

} else {

    let Make = Arguments.map(A => A.toLowerCase()).findIndex(V => V === "make");
    if (Make !== -1) Arguments.splice(Make, 1), Make = true;

    const Path = Arguments[0];

    if (!FS.existsSync(Path)) {
        if (Make !== true) {
            console.log([`${Format.BOLD("Error")}: ${Path} does not exist.`,
                "If you wish to create the database, include `make` in the command."
            ].join("\n"));

            process.exit(0);
        }

        FS.appendFileSync(Path, "");
    }

    require("./Menu")(Path);

}
