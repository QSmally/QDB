
const QDB = require("../QDB");
const CLI = require("cli-color");

process.stdout.write(CLI.reset);
process.stdout.write(CLI.cyan("Generating tables for benchmark...\n"));
const Trials = require("./Seed")();

process.stdout.write(CLI.reset);
process.stdout.write(CLI.cyan.bold("Running benchmarks...\n"));

for (const Trial of Trials) {
    const Benchmark = require(`./Trials/${Trial}`);
    const Connection = new QDB.Connection("Benchmark/Guilds.qdb", {...Benchmark.Options});
    process.stdout.write(CLI.white(`· Sampling '${CLI.white.bold(Trial.split(".")[0])}' benchmark... `));

    for (let i = 0; i < 10; i++) {
        Benchmark.Execute(Connection);
    }

    Connection.Disconnect();
}
