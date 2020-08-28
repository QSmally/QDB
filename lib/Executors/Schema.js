
const {Schema: SchemaModel} = require("../Utility/Schema");

/**
 * Automatically migrate data in the data upon a change in the Schema Model.
 * Use the `--migrate` or `-m` command line argument to migrate the database entries on startup of this Connection.
 * @param {Connection} Connection Reference to this Executor's Connection.
 * @returns {undefined}
 */
module.exports = Connection => {
    const Schema = Connection.ValOptions.Schema;
    if (Schema instanceof SchemaModel && ["--migrate", "-m"].some(Arg => process.argv.includes(Arg)))
    Connection.Each((Entry, Key) => Connection.Set(Key, Schema.Merge(Entry)));
}
