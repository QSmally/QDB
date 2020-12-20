
const Tables = require("./Tables");

const FS   = require("fs");
const Path = require("path");

module.exports = Pool => {

    const {Path: PathURL} = Pool;
    const BaseOptions = {
        ...Pool.ValOptions,
        Exclusives:      null,
        BackupInterval:  null,
        BackupDirectory: null
    };

    if (FS.lstatSync(PathURL).isDirectory()) {
        return FS.readdirSync(PathURL)
        .filter(Name => ["sqlite", "qdb", "db"].includes(Name.split(".").pop()))
        .filter(Name => !["-wal", "-shm"].some(Arg => Name.endsWith(Arg)))
        .forEach(Database => Tables(Pool, Path.join(PathURL, Database), BaseOptions));
    } else {
        return Tables(Pool, PathURL, BaseOptions);
    }
}
