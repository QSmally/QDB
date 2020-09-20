
const Connection = require("../../Connections/Connection");
const Thread     = require("./ThreadProvider/Thread");

const Path = require("path");
const SQL  = require("better-sqlite3");

module.exports = (Pool, PathURL, BaseOptions) => {
    const Main = new SQL(PathURL);

    Main.prepare("SELECT name FROM 'sqlite_master' WHERE type = 'table' AND name NOT LIKE 'sqlite_%';")
    .all().map(Entry => Entry.name).forEach((Table, _i, All) => {
        const Identifier = All.length > 1 ? Table :
        Path.basename(PathURL).split(".")[0];

        Pool.Databases.set(Identifier,
            new (Pool.ValOptions.Threads ? Thread : Connection)(PathURL, {
                ...Pool.ValOptions.Exclusives[Identifier] || BaseOptions, Table
            }, Pool)
        );
    });

    Main.close();
}
