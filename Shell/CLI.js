#!/usr/bin/env node
"use strict";

const FS        = require("fs");
const Format    = require("./Format");
const Arguments = process.argv.slice(2);

if (!Arguments.length) {

    const Commands = FS.readdirSync(__dirname + "/Store/")
    .map(C => C.split(".")[0]);

    console.log(["QDB Shell\n",
        `${Format.BOLD("USAGE")}\n  qdb <database> [\"make\" | flags]\n`,
        `${Format.BOLD("MENU")}\n${Format.LIST(Object.fromEntries(
            Commands.map(Cmd => [Cmd, require(`./Store/${Cmd}`).Description])
        ), 18)}\n`,
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

        if (!Path) return console.log(`${Format.BOLD("Error")}: supplied \`make\` without a database path.`);

        FS.appendFileSync(Path, "");
        console.log(`${Format.BOLD("Notice")}: database ${Path} has been created.`);
    }

    require("./Menu")(Path);

}
