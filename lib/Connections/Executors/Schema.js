
const {Schema} = require("../../Utility/Schema");

/**
 * Automatically migrate the database's entries upon a change in the Schema Model.
 * Use the `--migrate` or `-m` command line argument to migrate the database entries on startup of this Connection.
 * @param {Connection} Connection Reference to this Executor's Connection.
 * @returns {Boolean} Whether or not, when this Connection was instantiated, a data migration happened.
 */
module.exports = Connection => {

    const Model = Connection.ValOptions.Schema;
    if (!(Model instanceof Schema)) return null;

    if (["--migrate", "-m"].some(Arg => process.argv.includes(Arg))) {
        Connection.Each((Entry, Key) => Connection.Set(Key, Model.Instance(Entry)), false);
        return true;
    }
    
    return false;
}
