
module.exports = {
    Input:       true,
    Action:      "create",
    Description: "Creates a table in the given database file.",

    Execute: (Path, Table) => {
        console.log([Path, Table]);
    }
};
