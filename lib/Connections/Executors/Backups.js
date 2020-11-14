
const Pool = require("../Pool");

/**
 * Backup manager of the Connection or Pool, according to the given options.
 * @param {Connection|Pool} Connection Reference to this Executor's Connection or Pool.
 * @returns {Function?} Interval identifier to clear on disconnect.
 */
module.exports = Connection => {

    const IsPoolInstance = Connection instanceof Pool;

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

    return setInterval(async () => {
        try {
            if (IsPoolInstance) {
                const ResolvedBackupPath = Path.join(BackupDirectory, `${new Date().toISOString()}-${Path.basename(Connection.Path)}`);
                if (!FS.existsSync(ResolvedBackupPath)) FS.mkdirSync(ResolvedBackupPath, {recursive: true});

                if (FS.lstatSync(Connection.Path).isDirectory()) {
                    FS.readdirSync(Connection.Path).forEach(Database => {
                        FS.copyFile(Path.join(Connection.Path, Database), ResolvedBackupPath);
                    });
                } else {
                    FS.copyFile(Connection.Path, ResolvedBackupPath);
                }
            } else {
                const Snapshots = Path.join(BackupDirectory, `Snapshots-${Path.basename(Connection.Path).split(".")[0]}`);
                FS.mkdirSync(Snapshots, {recursive: true});
                Snapshot++;

                FS.copyFile(Connection.Path,
                    Path.join(Snapshot > SnapshotLifetime ? BackupDirectory : Snapshots,
                        `${new Date().toISOString()}-${Path.basename(Connection.Path)}`
                    )
                );

                if (Snapshot > SnapshotLifetime) {
                    if (FS.existsSync(Snapshots))
                    FS.rmdir(Snapshots, {recursive: true});
                    Snapshot = 0;
                }
            }
        } catch (Err) {
            console.error(`Failed to create a backup of ${IsPoolInstance ? "Pool" : "database"} '${Connection.Path}':\n`, Err.message);
        }
    }, BackupInterval);
}
