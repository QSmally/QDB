
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
        Interval,
        SnapshotLifetime,
        BackupDirectory
    } = Connection.ValOptions;

    return setInterval(() => {
        try {
            const Snapshots = Path.join(BackupDirectory, "_Snapshots");
            Snapshot < SnapshotLifetime ? Snapshot++ : Snapshot = 0;
            FS.mkdirSync(Snapshots, {recursive: true});

            FS.copyFileSync(Connection.Path,
                Path.join(Snapshots > SnapshotLifetime ? BackupDirectory : Snapshots, `${new Date().toISOString()}-${Path.basename(Connection.Path)}`)
            );

            if (Snapshot > SnapshotLifetime) {
                if (FS.existsSync(Snapshots))
                FS.rmdirSync(Snapshots);
                Snapshot = 0;
            }
        } catch {}
    }, Interval);
}
