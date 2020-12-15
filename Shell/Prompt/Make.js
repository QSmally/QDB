
const FS     = require("fs");
const Format = require("../Format");

module.exports = Database => {
    if (!Database) return console.log([
        `QDB Shell - ${Format.BOLD("make")}`,
        "\nMakes a new, QDB-formatted database file at the given path.\n",
        Format.BOLD("EXAMPLES"),
        "  qdb make Users.qdb",
        "  qdb make ./Content/Guilds.qdb",
        "  qdb make /usr/xy/Client.qdb"
    ].join("\n"));
    
    if (FS.existsSync(Database)) return console.log(
        `${Format.DIM("Error")}: file '${Database}' already exists.`
    );

    FS.appendFileSync(Database, "");
    console.log(`${Format.DIM("Success")}: database '${Database}' has been created.`);
}
