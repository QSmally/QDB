
const QDB = require("../QDB");

// Benchmark configuration
const Disconnect  = true;
const GarbageTest = false;
const Benchmark   = SampleBenchmark;


// Active testing
function Test () {

}

// Million queries benchmark
function Fetch () {
    const Guilds = new QDB.Connection("Test/Guilds.qdb", {
        Cache: true
    });

    console.log("benchmark: fetch 1 million random queries");
    const Indexes = Guilds.Indexes;

    console.time("time-for-million-reads");

    for (let i = 0; i < 1000 * 1000; i++) {
        const Id = Indexes[Math.round(Math.random() * Indexes.length)];
        if (!Id) continue;
        Guilds.Fetch(Id);
    }

    console.log(`cache size: ${Guilds.CacheSize}`);
    console.timeEnd("time-for-million-reads");
    console.log(`memory usage: ${process.memoryUsage().heapUsed / 1024 / 1024} MB`);

    if (Disconnect) Guilds.Disconnect();
}

// Benchmark samples
function SampleBenchmark (Samples, Amount) {
    const Guilds = new QDB.Connection("Test/Guilds.qdb");

    const Indexes = Guilds.Indexes;
    const Length  = Indexes.length
    const Times   = {};

    console.log("Sampling fetch benchmark...");

    function Sample (Iter) {
        const Current = process.hrtime();

        for (let i = 0; i < Amount; i++) {
            const Id = Indexes[Math.floor(Math.random() * Length)];
            const FetchedEntry = Guilds.Fetch(Id);
        }

        const hrtime = process.hrtime(Current);
        const Seconds = hrtime[0] + (hrtime[1] / 1000000000);

        Times[Iter] = {
            hrtime,
            s: Seconds,
            reqs: Amount / Seconds
        };
    }

    for (let i = 0; i < Samples + 1; i++) Sample(i);
    delete Times[0];

    const FetchesPerSecond = Object.keys(Times).map(k => Math.round(Times[k].reqs));
    const FormattedTable = Object.fromEntries(Object.keys(Times).map(Iter => [Iter, {
        TotalSeconds: Times[Iter].s,
        ReqPerSecond: Math.round(Times[Iter].reqs)
    }]));

    console.table(FormattedTable);

    console.log({
        max: Math.max(...FetchesPerSecond) + " req/s",
        min: Math.min(...FetchesPerSecond) + " req/s",
        avg: FetchesPerSecond.reduce((a, b) => a + b) / Samples + " req/s",
    })
}


if (typeof Benchmark === "function") Benchmark(15, 1000 * 1000);

// Garbage collector
if (GarbageTest) {
    let i = 0;
    setInterval(() => {
        console.log(`${i++}: ${process.memoryUsage().heapUsed / 1024 / 1024}`);
    }, 500);
}
