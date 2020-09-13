
const Tables = require("./Tables");

const FS   = require("fs");
const Path = require("path");

module.exports = Pool => {
    const {Path: PathURL} = Pool;

    if (FS.lstat(PathURL).isDirectory()) {
        FS.readdirSync(PathURL).forEach(Database => {
            Tables(Pool, Path.join(PathURL, Database));
        });
    }
    
    Tables(Pool, PathURL);
}
