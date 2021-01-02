
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

    Connection: require("./lib/Connections/Connection"),
    Pool:       require("./lib/Connections/Pool"),

    Schema: DataSchema.Schema,

    Model: Id => {
        if (typeof Id !== "string") return null;
        return DataSchema.ModelStore.resolve(Id);
    }

};
