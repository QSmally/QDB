
/*
    Generates QDB documentation
*/

const Path = require("path");
const FS   = require("fs");
let Files  = [];

FS.readdirSync("./lib/").forEach(Section => {
    if (FS.statSync(`./lib/${Section}`).isDirectory())
    FS.readdirSync(`./lib/${Section}`).forEach(File => Files.push(`./lib/${Section}/${File}`));
    else Files.push(`./lib/${Section}`);
});

const Keys = Object.keys(require("../../QDB"));
Files.filter(File => Keys.includes(Path.basename(File, ".js")))
.forEach((Context, _i, Files) => {
    const Parsed = require("./Parse")(Context);
    if (Parsed.length) require("./Format")(Files.map(File => Path.basename(File, ".js")), Context, Parsed);
});
