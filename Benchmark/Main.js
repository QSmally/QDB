
const QDB = require("../QDB");
const CLI = require("cli-color");

process.stdout.write(CLI.reset);
const {Trials, Tables} = require("./Seed")();
process.stdout.write(CLI.cyan.bold("Running benchmarks...\n"));

const Times = new Map();

for (const Trial of Trials) {
    const Test = Trial.split(".")[0];
    const Benchmark = require(`./Trials/${Trial}`);
    process.stdout.write(CLI.white(`· Sampling '${CLI.bold(Test)}' benchmark...`));

    Times.set(Test, {});

    for (const [Table, Size] of Tables) {
        const Connection = new QDB.Connection("Benchmark/Guilds.qdb", {
            Table
        });

        const StartTime = process.hrtime();
        const Amount    = Benchmark(Connection);
        const EndTime   = process.hrtime(StartTime);
        const Time      = EndTime[0] + (EndTime[1] / 1000000000);

        Times.get(Test)[Table] = {
            OpsPerSec: Amount / Time,
            Time, Amount, Size
        };
    }


    const TrialTimes = Times.get(Test);
    process.stdout.write(CLI.erase.line);
    process.stdout.write(CLI.move(-31 - Test.length));

    process.stdout.write(CLI.magenta(CLI.bold(Test) +
        `\n  (${Math.round(TrialTimes["Small"].OpsPerSec)} ops/s)` +
        `\n  (Amount: ${TrialTimes[Object.keys(TrialTimes).pop()].Amount})`
    ));

    for (const Table in TrialTimes)
    process.stdout.write(CLI.white(
        `\n· ${CLI.bold(Table.padEnd(15))}` +
        CLI.green.bold(`${TrialTimes[Table].Time.toFixed(2)}s`)
    ));

    process.stdout.write("\n\n");
}

process.stdout.write(CLI.green("Completed running benchmarks!\n"));
