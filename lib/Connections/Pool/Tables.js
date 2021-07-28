
const Connection = require("../Connection");
const SQL        = require("better-sqlite3");

const { basename } = require("path");
const { model }    = require("../../../QDB");

module.exports = (pool, pathURL, baseOptions) => {
    try {
        const main = new SQL(pathURL);

        main
            .prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table';")
            .all()
            .map(entry => entry.name)
            .forEach((table, _i, all) => {
                const identifier = all.length > 1 ?
                    table :
                    basename(pathURL).split(".")[0];

                const schema = baseOptions.binding ?
                    model(Table) :
                    undefined;

                pool.store.set(identifier,
                    new Connection(pathURL, {
                        schema,
                        ...baseOptions,
                        ...pool.valOptions.exclusives[identifier],
                        identifier,
                        table
                    }, pool)
                );
            });

        main.close();
    } catch (_) {}
}
