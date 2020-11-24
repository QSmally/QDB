
const QDB = require("../QDB");
const CLI = require("cli-color");

process.stdout.write(CLI.reset);
process.stdout.write(CLI.cyan("Generating tables for benchmark...\n"));
const Trials = require("./Seed")();

process.stdout.write(CLI.reset);
process.stdout.write(CLI.cyan.bold("Running benchmarks...\n"));

const Times = new Map();

for (const Trial of Trials) {
    const Test = Trial.split(".")[0];

    const Benchmark = require(`./Trials/${Trial}`);
    const Connection = new QDB.Connection("Benchmark/Guilds.qdb", {...Benchmark.Options});
    process.stdout.write(CLI.white(`· Sampling '${CLI.white.bold(Test)}' benchmark...`));

    Times.set(Test, []);

    for (let i = 0; i < 10; i++) {
        const StartTime = process.hrtime();
        Benchmark.Execute(Connection);
        Times.get(Test).push(process.hrtime(StartTime));
    }

    Connection.Disconnect();
}

console.log(Times);
