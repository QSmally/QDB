
const Tables = new Map([
    ["Small", 100],
    ["Medium", 20000],
    ["Large", 50000],
    ["Enterprise", 800000]
]);

module.exports = () => {

    const FS  = require("fs");
    const CLI = require("cli-color");

    const Crypto = require("crypto");
    const QDB    = require("../QDB");
    const SQL    = require("better-sqlite3");
    const Master = new SQL("Benchmark/Guilds.qdb");

    // Completely remove tables
    Master.prepare("SELECT * FROM 'sqlite_master' WHERE type = 'table';")
    .all().forEach(Entry => Master.exec(`DROP TABLE '${Entry.name}';`));
    Master.close();

    // Create new Connections
    for (const [Table, Size] of Tables) {
        const Connection = new QDB.Connection("Benchmark/Guilds.qdb", {
            Cache: false, Table
        });

        process.stdout.write(CLI.white(`· Creating '${CLI.white.bold(Table)}' table... `));

        for (let i = 0; i < Size; i++) {
            Connection.Set(Crypto.randomBytes(8).toString("hex"), {
                Username: [
                    "Jake", "Smally", "Amy", "Foo", "Bar", "Apolly"
                ][Math.round(Math.random() * 5)],

                Password: Crypto.randomBytes(32).toString("hex"),

                Hobbies: [
                    ["Sleep", "Programming"],
                    ["Eating", "Yoga"],
                    ["Skating"]
                ][Math.round(Math.random() * 2)]
            });
        }

        process.stdout.write(
            Table.padEnd(10, " ").slice(Table.length) +
            CLI.green(`Created ${CLI.bold(Connection.Size)} entries\n`)
        );

        Connection.Disconnect();
    }

    return FS.readdirSync("Benchmark/Trials/", {
        encoding: "utf-8"
    });

}
