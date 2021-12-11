
const FS     = require("fs");
const Format = require("../Formatter");

module.exports = database => {
    if (!database) return console.log([
        `QDB Shell - ${Format.bold("make")}`,
        "\nMakes a new, QDB-formatted database file at the given path.\n",
        Format.bold("EXAMPLES"),
        "  qdb make Users.qdb",
        "  qdb make ./Cellar/Guilds.qdb",
        "  qdb make /usr/xy/Service.qdb"
    ].join("\n"));

    if (FS.existsSync(database)) return console.log(
        `${Format.dim("Error")}: file '${database}' already exists.`
    );

    FS.appendFileSync(database, "");
    console.log(`${Format.dim("Success")}: database file '${database}' has been created.`);
}
