
const { Connection } = require("../QDB");

const FS     = require("fs");
const Crypto = require("crypto");
const CLI    = require("cli-color");
const SQL    = require("better-sqlite3");

const tables = new Map([
    ["Small", 100],
    ["Medium", 20000],
    ["Large", 50000],
    ["Enterprise", 800000]
]);

module.exports = () => {
    if (process.argv.includes("--no-enterprise")) {
        tables.delete("Enterprise");
    }

    if (!process.argv.includes("--skip")) {
        process.stdout.write(CLI.cyan.bold("Generating tables for benchmark...\n"));

        const master = new SQL("Benchmark/Guilds.qdb");

        // Completely remove tables
        master.prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table';")
            .all()
            .forEach(entry => master.prepare(`DROP TABLE '${entry.name}';`).run());
        master.close();

        // Populate the databases
        for (const [table, size] of tables) {
            const connection = new Connection("Benchmark/Guilds.qdb", {
                insertionCache: false,
                table
            });

            process.stdout.write(CLI.white(`· Creating '${CLI.bold(table)}' table... `));
            const transaction = connection.transaction();
            const tStart = process.hrtime();

            for (let i = 0; i < size; i++) {
                connection.set(Crypto.randomBytes(8).toString("hex"), {
                    username: [
                        "Jake", "Smally", "Amy", "Foo", "Bar", "Apolly"
                    ][i % 6],

                    password: Crypto.randomBytes(32).toString("hex"),

                    hobbies: [
                        ["Sleep", "Programming"],
                        ["Eating", "Yoga"],
                        ["Skating"]
                    ][Math.round(Math.random() * 2)]
                });
            }

            transaction.commit();

            const tEnd = process.hrtime(tStart);
            const time = tEnd[0] + (tEnd[1] / 1000000000);

            process.stdout.write(
                table.padEnd(10, " ").slice(table.length) +
                CLI.green(`Created ${CLI.bold(connection.size.toLocaleString())} entries `) +
                CLI.white(`(${time.toFixed(3)}s)\n`)
            );

            connection.disconnect();
        }
    }

    const trials = FS.readdirSync("Benchmark/Trials/");
    return { trials, tables };
}
