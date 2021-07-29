
const QDB = require("../QDB");
const CLI = require("cli-color");

process.stdout.write(CLI.reset);
const { trials, tables } = require("./Seed")();
process.stdout.write(CLI.cyan.bold("Running benchmarks...\n"));

const times = new Map();

for (const trial of trials) {
    const test = trial.split(".")[0];
    const benchmark = require(`./Trials/${trial}`);
    process.stdout.write(CLI.white(`· Sampling '${CLI.bold(test)}' benchmark...`));

    times.set(test, {});

    // Test each table's performance
    for (const [table, size] of tables) {
        const connection = new QDB.Connection("Benchmark/Guilds.qdb", {
            table, sweepInterval: false
        });

        const { amount, tEnd } = benchmark(connection);
        const time = tEnd[0] + (tEnd[1] / 1000000000);

        times.get(test)[table] = {
            opsPerSec: amount / time,
            time, amount, size
        };

        connection.disconnect();
    }

    // Publish trial time
    const current = times.get(test);
    process.stdout.write(CLI.erase.line);
    process.stdout.write(CLI.move(-31 - test.length));

    process.stdout.write(CLI.magenta(CLI.bold(test) +
        `\n  (${Math.round(Math.max(...Object.values(current).map(M => M.opsPerSec)))} ops/s)` +
        `\n  (${current[Object.keys(current).pop()].amount} entries)`
    ));

    for (const table in current)
        process.stdout.write(CLI.white(
            `\n· ${CLI.bold(table.padEnd(15))}` +
            CLI.green.bold(`${current[table].time.toFixed(3)}s`)
        ));

    process.stdout.write("\n\n");
}

process.stdout.write(CLI.green("Completed running benchmarks!\n"));
