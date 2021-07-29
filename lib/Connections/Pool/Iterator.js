
const { join } = require("path");
const tables   = require("./Tables");

const { lstatSync, readdirSync } = require("fs");

module.exports = pool => {
    const { path: pathURL } = pool;

    const baseOptions = {
        ...pool.valOptions,
        exclusives: undefined
    };

    if (lstatSync(pathURL).isDirectory()) return readdirSync(pathURL)
        .filter(name => ["sqlite", "qdb", "db"].includes(name.split(".").pop()))
        .filter(name => !["-wal", "-shm"].some(argument => name.endsWith(argument)))
        .forEach(database => tables(pool, join(pathURL, database), baseOptions));

    return tables(pool, pathURL, baseOptions);
}
