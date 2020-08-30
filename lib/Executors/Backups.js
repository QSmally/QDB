
/**
 * Backup manager of the Connection, according to the given options.
 * @param {Connection} Connection Reference to this Executor's Connection.
 * @returns {Function}
 */
module.exports = Connection => {

    let Snapshot   = 0;
    const Lifetime = Connection.ValOptions.SnapshotLifetime;
    const Interval = Connection.ValOptions.BackupInterval;

    return setInterval(() => {
        if (Snapshot < Lifetime) {
            Snapshot++;
            // Create snapshot
        } else {
            Snapshot = 0;
            // Merge snapshots
        }
    }, Interval);
}
