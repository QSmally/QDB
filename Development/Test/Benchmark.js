
const QDB = require("../../QDB");

const Guilds = new QDB.Connection("Development/Test/Guilds.qdb", {
    // Change this to true/false for (no) caching
    Cache: false
});

// START READ TIME
const Indexes = Guilds.API.prepare("SELECT * FROM 'QDB';").all().map(v => v.Key);

console.time("time-for-100k-reads");

for (let i = 0; i < 100 * 1000; i++) {
    const Id = Indexes[Math.round(Math.random() * Indexes.length)];
    if (!Id) continue;

    console.time("per-fetch");
    const Ft = Guilds.Fetch(Id);
    console.timeEnd("per-fetch");
    console.log(Ft);
}

console.log(`cache size: ${Guilds.CacheSize}`);
console.timeEnd("time-for-100k-reads");
console.log(`memory usage: ${process.memoryUsage().heapUsed / 1024 / 1024} MB`);



// START WRITE
// TODO: Make benchmark from this
// for (let i = 0; i < 50000; i++) {
//     const Id = (Math.random() * 10).toString(36).replace(/\./g, "_");
//     Guilds.Set(Id, {
//         foo: "bar"
//     });
// }
