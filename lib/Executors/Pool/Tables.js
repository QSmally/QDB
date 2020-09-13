
const Connection = require("../../Connections/Connection");

const Path = require("path");

module.exports = (Pool, PathURL) => {
    const BaseOptions = Object.assign({
        ...Pool.ValOptions
    }, {
        Exclusives:       null,
        Threads:          null,
        SnapshotLifetime: null,
        BackupInterval:   null,
        BackupDirectory:  null
    });

    const Database = new Connection(PathURL, {
        ...Pool.ValOptions.Exclusives[Path.basename(PathURL).split(".")[0]] || BaseOptions
    });
}
