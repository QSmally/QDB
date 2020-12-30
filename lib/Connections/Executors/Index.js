
"use strict";

const Executors = {
    Schema:         require("./Schema"),
    FetchAll:       require("./Fetch"),
    SweepInterval:  require("./Sweep"),
    BackupInterval: require("./Backups")
};

module.exports = Executors;
