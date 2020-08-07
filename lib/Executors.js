
"use strict";

const Executors = {
    Schema:        require("./Executors/Schema"),
    FetchAll:      require("./Executors/Fetch"),
    SweepInterval: require("./Executors/Sweep"),
    Backups:       require("./Executors/Backups")
};

module.exports = Executors;
