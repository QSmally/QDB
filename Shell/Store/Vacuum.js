
const SQL = require("better-sqlite3");

module.exports = {
    Usage: "qdb <database> vacuum",
    Description: "Rebuilds this database, repacking it into a minimal amount of disk space.",
    Examples: [
        "qdb Guilds.qdb vacuum",
    ],

    Arguments: 0,

    Execute: Path => {

        const Connection = new SQL(Path);

        process.stdout.write("Repacking database file... ");
        Connection.prepare("VACUUM;").run();
        Connection.close();

        console.log("Successfully vacuumed the database.");
        return true;

    }
};
