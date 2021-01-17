
const Tables = new Map([
    ["Small", 100],
    ["Medium", 20000],
    ["Large", 50000],
    ["Enterprise", 800000]
]);

module.exports = () => {

    const FS  = require("fs");
    const CLI = require("cli-color");

    if (process.argv.includes("--no-enterprise")) {
        Tables.delete("Enterprise");
    }

    if (!process.argv.includes("--skip")) {
        process.stdout.write(CLI.cyan.bold("Generating tables for benchmark...\n"));

        const Crypto = require("crypto");
        const QDB    = require("../QDB");
        const SQL    = require("better-sqlite3");
        const Master = new SQL("Benchmark/Guilds.qdb");

        // Completely remove tables
        Master.prepare("SELECT * FROM 'sqlite_master' WHERE type = 'table';")
        .all().forEach(Entry => Master.prepare(`DROP TABLE '${Entry.name}';`).run());
        Master.close();

        // Create new Connections
        for (const [Table, Size] of Tables) {
            const Connection = new QDB.Connection("Benchmark/Guilds.qdb", {
                Cache: false, Table
            });

            process.stdout.write(CLI.white(`· Creating '${CLI.bold(Table)}' table... `));
            const Transaction = Connection.Transaction();
            const TStart = process.hrtime();

            for (let i = 0; i < Size; i++) {
                Connection.Set(Crypto.randomBytes(8).toString("hex"), {
                    Username: [
                        "Jake", "Smally", "Amy", "Foo", "Bar", "Apolly"
                    ][i % 6],

                    Password: Crypto.randomBytes(32).toString("hex"),

                    Hobbies: [
                        ["Sleep", "Programming"],
                        ["Eating", "Yoga"],
                        ["Skating"]
                    ][Math.round(Math.random() * 2)]
                });
            }

            Transaction.Commit();

            const TEnd = process.hrtime(TStart);
            const Time = TEnd[0] + (TEnd[1] / 1000000000);

            process.stdout.write(
                Table.padEnd(10, " ").slice(Table.length) +
                CLI.green(`Created ${CLI.bold(Connection.Size)} entries `) +
                CLI.white(`(${Time.toFixed(3)}s)\n`)
            );

            Connection.Disconnect();
        }
    }

    return {
        Trials: FS.readdirSync("Benchmark/Trials/"),
        Tables
    }

}
