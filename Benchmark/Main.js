
const QDB = require("../QDB");
const CLI = require("cli-color");

process.stdout.write(CLI.reset);
process.stdout.write(CLI.cyan("Generating tables for benchmark...\n"));
const {Trials, Tables} = require("./Seed")();

process.stdout.write(CLI.reset);
process.stdout.write(CLI.cyan.bold("Running benchmarks...\n"));

const Times = new Map();

for (const Trial of Trials) {
    const Test = Trial.split(".")[0];

    const Benchmark = require(`./Trials/${Trial}`);
    process.stdout.write(CLI.white(`· Sampling '${CLI.white.bold(Test)}' benchmark...`));

    Times.set(Test, []);

    for (const [Table, Size] of Tables) {
        const Connection = new QDB.Connection("Benchmark/Guilds.qdb", {
            Table
        });

        const StartTime = process.hrtime();
        const Amount    = Benchmark(Connection);
        const EndTime   = process.hrtime(StartTime);

        Times.get(Test).push({
            Time: EndTime[0] + (EndTime[1] / 1000000000),
            Amount, Size
        });
    }
}

console.log(Times);
