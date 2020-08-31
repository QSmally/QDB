
/**
 * Backup manager of the Connection, according to the given options.
 * @param {Connection} Connection Reference to this Executor's Connection.
 * @returns {Function}
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
            if (Snapshot < SnapshotLifetime) {
                if (!FS.existsSync(Snapshots)) FS.mkdirSync(Snapshots, {recursive: true});
                FS.copyFileSync(Connection.Path, Snapshots);
                Snapshot++;
            } else {
                if (!FS.existsSync(BackupDirectory)) FS.mkdirSync(BackupDirectory, {recursive: true});
                if (FS.existsSync(Snapshots)) FS.rmdirSync(Snapshots);
                FS.copyFileSync(Connection.Path, BackupDirectory);
                Snapshot = 0;
            }
        } catch {}
    }, Interval);
}
