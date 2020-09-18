
module.exports = Pool => {

    const FS   = require("fs");
    const Path = require("path");

    const {
        BackupInterval,
        BackupDirectory
    } = Pool.ValOptions;

    if (BackupInterval < 1800000)            return null;
    if (typeof BackupDirectory !== "string") return null;

    return setInterval(() => {
        try {
            const ResolvedBackupPath = Path.join(BackupDirectory, `${new Date().toISOString()}-${Path.basename(Pool.Path)}`);
            if (!FS.existsSync(ResolvedBackupPath)) FS.mkdirSync(ResolvedBackupPath, {recursive: true});

            if (FS.lstatSync(Pool.Path).isDirectory()) {
                FS.readdirSync(Pool.Path).forEach(Database => {
                    FS.copyFileSync(Path.join(Pool.Path, Database), ResolvedBackupPath);
                });
            } else {
                FS.copyFileSync(Pool.Path, ResolvedBackupPath);
            }
        } catch (Err) {
            console.error(`Failed to create a backup of pool '${Pool.Path}': \n`, Err.message);
        }
    }, BackupInterval);
}
