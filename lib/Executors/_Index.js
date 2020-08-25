
"use strict";

const Executors = {
    FetchAll:       require("./Fetch"),
    SweepInterval:  require("./Sweep"),
    BackupInterval: require("./Backups")
};

module.exports = Executors;
