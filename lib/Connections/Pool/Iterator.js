
const Tables = require("./Tables");

const FS   = require("fs");
const Path = require("path");

const Ext = ["json", "yaml", "md", "js"];
const Sys = ["wal", "shm"];

module.exports = Pool => {

    const {Path: PathURL} = Pool;
    const BaseOptions = Object.assign({
        ...Pool.ValOptions
    }, {
        Exclusives:      null,
        BackupInterval:  null,
        BackupDirectory: null
    });

    if (FS.lstatSync(PathURL).isDirectory()) {
        return FS.readdirSync(PathURL)
        .filter(Name => !Ext.includes(Name.split(".").pop()))
        .filter(Name => !Sys.some(Arg => Name.endsWith(Arg)))
        .forEach(Database => {
            Tables(Pool, Path.join(PathURL, Database), BaseOptions);
        });
    } else {
        return Tables(Pool, PathURL);
    }
}
