
const Connection = require("../Connection");
const {Model}    = require("../../../QDB");

const Path = require("path");
const SQL  = require("better-sqlite3");

module.exports = (Pool, PathURL, BaseOptions) => {
    try {
        const Main = new SQL(PathURL);

        Main.prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table';")
        .all().map(Entry => Entry.name).forEach((Table, _i, All) => {
            const Identifier = All.length > 1 ? Table :
            Path.basename(PathURL).split(".")[0];

            const Schema = BaseOptions.Binding ? Model(Table) : undefined;

            Pool.Store.set(Identifier,
                new Connection(PathURL, {
                    Schema,
                    ...BaseOptions,
                    ...Pool.ValOptions.Exclusives[Identifier],
                    Identifier, Table
                }, Pool)
            );
        });

        Main.close();
    } catch (_) {}
}
