
const QDB = require("../QDB");
const Guilds = new QDB.Connection("Test/Guilds.qdb", {
    Cache: true
});

const Disconnect  = true;
const GarbageTest = true;
const Benchmark   = Fetch;


// Active testing
function Test () {
    
}

// Million queries benchmark
function Fetch () {
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
}


if (typeof Benchmark === "function") Benchmark();
if (Disconnect) Guilds.Disconnect();

// Garbage collector
if (GarbageTest) {
    let i = 0;
    setInterval(() => {
        console.log(`${i++}: ${process.memoryUsage().heapUsed / 1024 / 1024}`);
    }, 500);
}
