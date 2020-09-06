
/**
 * Backup manager of the Connection, according to the given options.
 * @param {Connection} Connection Reference to this Executor's Connection.
 * @returns {Function} Interval identifier to clear on disconnect.
 */
module.exports = Connection => {

    const FS     = require("fs");
    const Path   = require("path");
    let Snapshot = 0;

    const {
        SnapshotLifetime,
        BackupInterval,
        BackupDirectory
    } = Connection.ValOptions;

    if (SnapshotLifetime > 120)              return null;
    if (BackupInterval < 1800000)            return null;
    if (typeof BackupDirectory !== "string") return null;

    return setInterval(() => {
        try {
            const Snapshots = Path.join(BackupDirectory, "_Snapshots");
            FS.mkdirSync(Snapshots, {recursive: true});
            Snapshot++;

            FS.copyFileSync(Connection.Path,
                Path.join(Snapshot > SnapshotLifetime ? BackupDirectory : Snapshots,
                    `${new Date().toISOString()}-${Path.basename(Connection.Path)}`
                )
            );

            if (Snapshot > SnapshotLifetime) {
                if (FS.existsSync(Snapshots))
                FS.rmdirSync(Snapshots, {recursive: true});
                Snapshot = 0;
            }
        } catch (Err) {
            console.error(`Failed to create a backup of database '${Conncetion.Path}': \n`, Err.message);
        }
    }, BackupInterval);
}
