
const CLI = require("cli-color");

const { Connection, CacheStrategy } = require("../QDB");

class Benchmark {

    times = new Map();
    assets = require("./InsertionSeed")();

    constructor() {
        Benchmark.stdout(CLI.cyan.bold("Running benchmarks...\n"));

        for (const trial of this.assets.trials) {
            const testIdentifier = trial.split(".")[0];
            const benchmark = require(`./Trials/${trial}`);
            Benchmark.stdout(CLI.white(`· Sampling '${CLI.bold(testIdentifier)}' benchmark...`));

            // Test each table's performance
            this.times.set(testIdentifier, {});
            this.test(testIdentifier, benchmark);

            // Publish trial time
            const current = this.times.get(testIdentifier);
            Benchmark.stdout(CLI.erase.line);
            Benchmark.stdout(CLI.move(-31 - testIdentifier.length));

            const operationsPerSecond = Math.round(Math.max(...Object
                .values(current)
                .map(table => table.opsPerSec)));
            const amountOfEntities = current[Object.keys(current).pop()].amount;

            Benchmark.stdout(CLI.magenta(CLI.bold(testIdentifier) +
                `\n  (${operationsPerSecond} ops/s)` +
                `\n  (${amountOfEntities} entries)`
            ));

            for (const table in current)
                Benchmark.stdout(CLI.white(
                    `\n· ${CLI.bold(table.padEnd(15))}` +
                    CLI.green.bold(`${current[table].time.toFixed(3)}s`)
                ));

            Benchmark.stdout("\n\n");
        }
    }

    static stdout(textContent) {
        process.stdout.write(textContent);
    }

    test(testIdentifier, benchmark) {
        for (const [table, size] of this.assets.tables) {
            const connection = new Connection("Benchmark/Guilds.qdb", {
                cache: CacheStrategy.unlimited(),
                table
            });
    
            const { amount, tEnd } = benchmark(connection);
            const time = tEnd[0] + (tEnd[1] / 1e9);
    
            this.times.get(testIdentifier)[table] = {
                opsPerSec: amount / time,
                time,
                amount,
                size
            };
    
            connection.disconnect();
        }
    }
}

Benchmark.stdout(CLI.reset);
new Benchmark();

Benchmark.stdout(CLI.green("Completed running benchmarks!\n"));
process.exit(0);
