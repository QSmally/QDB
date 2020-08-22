
const QDB = require("../QDB");

const Guilds = new QDB.Connection("Test/Guilds.qdb", {
    // Change this to true/false for (no) caching
    // Cache: false
});

// START READ TIME
// console.log("benchmark: fetch 1 million random queries");
// const Indexes = Guilds.Indexes;

// console.time("time-for-million-reads");

// for (let i = 0; i < 1000 * 1000; i++) {
//     const Id = Indexes[Math.round(Math.random() * Indexes.length)];
//     if (!Id) continue;

//     // console.time("per-fetch");
//     const Ft = Guilds.Fetch(Id);
//     // console.timeEnd("per-fetch");
// }

// // console.log(Guilds.Cache);
// console.log(`cache size: ${Guilds.CacheSize}`);
// console.timeEnd("time-for-million-reads");
// console.log(`memory usage: ${process.memoryUsage().heapUsed / 1024 / 1024} MB`);

// Guilds.Disconnect();



// START EACH BENCHMARK
// Garbage collector test
console.log("benchmark: iterate through 50k queries");

let i = 0;
function log() {
    const {heapUsed} = process.memoryUsage();
    console.log(`${i++}: ${heapUsed / 1024 / 1024} MB`);
}

log();

(() => {
    Guilds.Select((Entry, Idx) => {
        return Math.random() > 0.8;
    });
    log();
})();

console.log([Guilds.Size, Guilds.CacheSize]);
log();

Guilds.Disconnect();

setInterval(() => {
    log();
}, 5 * 1000);



// START WRITE
// TODO: Make benchmark from this
// for (let i = 0; i < 50000; i++) {
//     const Id = (Math.random() * 10).toString(36).replace(/\./g, "_");
//     Guilds.Set(Id, {
//         foo: "bar"
//     });
// }



// START THREAD
// console.log("benchmark: use threads to fetch queries");
// const {Worker, isMainThread, parentPort, workerData} = require("worker_threads");
// const Indexes = Guilds.API.prepare("SELECT * FROM 'QDB';").all().map(v => v.Key);

// if (isMainThread) {
//     console.time("time-for-one-thread");
//     const Id = Indexes[Math.round(Math.random() * Indexes.length)];

//     new Worker(__filename, {
//         workerData: Id
//     })

//     .on("message", m => console.log(m))
//     .on("error", e => console.log(`[Error Received] ${e}`))
//     .on("exit", c => {
//         console.log(`Thread exited with code ${c}`);
//         console.timeEnd("time-for-one-thread");
//     });

//     console.time("time-for-main-process");
//     for (let i = 0; i < 10; i++) {
//         const Id = Indexes[Math.round(Math.random() * Indexes.length)];
//         const data = Guilds.Fetch(Id);
//     }
//     console.timeEnd("time-for-main-process");
// } else {
//     for (let i = 0; i < 10; i++) {
//         const data = Guilds.Fetch(workerData);
//         parentPort.postMessage(data);
//     }
// }
