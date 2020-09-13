
const Tables = require("./Tables");

const FS   = require("fs");
const Path = require("path");

const Ext = ["json", "yaml", "md", "js"];

module.exports = Pool => {
    const {Path: PathURL} = Pool;

    if (FS.lstatSync(PathURL).isDirectory()) {
        return FS.readdirSync(PathURL)
        .filter(Name => !Ext.includes(Name.split(".").pop()))
        .forEach(Database => {
            Tables(Pool, Path.join(PathURL, Database));
        });
    }
    
    Tables(Pool, PathURL);
}
