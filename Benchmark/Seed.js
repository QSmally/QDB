
module.exports = () => {

    const QDB    = require("../QDB");
    const SQL    = require("better-sqlite3");
    const Master = new SQL("Benchmark/Guilds.qdb");

    // Completely remove tables
    Master.prepare("SELECT * FROM 'sqlite_master' WHERE type = 'table';")
    .all().forEach(Entry => Master.exec(`DROP TABLE '${Entry.name}';`));
    Master.close();

    // Create new Connections
    // for (const [Table, Context] of Tables) {}

    return [];

}
