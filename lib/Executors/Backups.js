
/**
 * Backup manager of the Connection, according to the given options.
 * @param {Connection} Connection Reference to this Executor's Connection.
 * @returns {Function}
 */
module.exports = Connection => {
    let Snapshot = 0;
    return setInterval(() => {
        if (Snapshot < 5) {
            Snapshot++;
            // Create snapshot
        } else {
            Snapshot = 0;
            // Merge snapshots
        }
    }, Connection.ValOptions.BackupInterval);
}
