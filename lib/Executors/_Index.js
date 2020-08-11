
"use strict";

const Executors = {
    Schema:        require("./Schema"),
    FetchAll:      require("./Fetch"),
    SweepInterval: require("./Sweep"),
    Backups:       require("./Backups")
};

module.exports = Executors;
