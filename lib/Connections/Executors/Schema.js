
const { Schema } = require("../../Utility/Schema");

/**
 * Automatically migrate the database's entries upon a change in the Schema Model.
 * Use the `--migrate` or `-m` command line argument to migrate the database entries on startup of this Connection.
 * @param {Connection} connection Reference to this Executor's Connection.
 * @returns {Boolean} Whether or not, when this Connection was instantiated, a data migration happened.
 */
module.exports = connection => {
    const shouldMigrateEntries = ["--migrate", "-m"].some(argument => process.argv.includes(argument));
    const model = connection.valOptions.schema;
    if (!(model instanceof Schema)) return null;

    if (shouldMigrateEntries) {
        const transaction = connection.transaction();
        connection.each((entry, key) => connection.set(key, model.instance(entry)));
        return transaction.commit();
    }

    return false;
}
