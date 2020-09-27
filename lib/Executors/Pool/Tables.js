
const Connection = require("../../Connections/Connection");
const Gateway    = require("./ThreadProvider/Gateway");

const Path = require("path");
const SQL  = require("better-sqlite3");

module.exports = (Pool, PathURL, BaseOptions) => {
    const Main = new SQL(PathURL);

    Main.prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table' AND name NOT LIKE 'sqlite_%';")
    .all().map(Entry => Entry.name).forEach((Table, _i, All) => {
        const Identifier = All.length > 1 ? Table :
        Path.basename(PathURL).split(".")[0];

        Pool.Store.set(Identifier,
            new (Pool.ValOptions.Threaded ? Gateway : Connection)(PathURL, {
                ...Pool.ValOptions.Exclusives[Identifier] || BaseOptions,
                Table, Identifier
            }, Pool)
        );
    });

    Main.close();
}
