
/*
    QDB is built from the ground up by QSmally.
    QDB © 2018-2021 by QSmally, all rights reserved.
    Please report bugs by creating an issue on the repo.

    Obviously the Node runtime (and all respective libraries)
    are not created by myself, they're created by their
    owners. All rights are reserved.

    Qulity © 2021 by QSmally.
*/


const DataSchema = require("./lib/Utility/Schema");

module.exports = {

    Connection:    require("./lib/Connections/Connection"),
    Pool:          require("./lib/Connections/Pool"),
    BackupManager: require("./lib/Connections/Backups/Manager"),

    // Utility
    Schema: DataSchema.Schema,

    // Model bindings
    model: id => {
        if (typeof id !== "string") return null;
        return DataSchema.modelStore.resolve(id);
    },

    // Order enumeration
    // These are left out as strings to be as backwards- compatible
    // as possible. As the previous version had just strings as inputs,
    // this was necessary.
    arbitrary: "arbitrary",
    ascending: "ascending",
    descending: "descending"

};
