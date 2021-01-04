
const FS   = require("fs");
const Path = require("path");

const {
    PathURL, Destination, Interval, Snapshots
} = process.env;

let SnapshotIdx = 0;


function Backup (ResolvedPath) {
    ResolvedPath += `-${new Date().toISOString()}`;

    if (FS.lstatSync(PathURL).isDirectory()) {
        FS.readdirSync(PathURL).forEach(Database => {
            FS.copyFile(Path.join(PathURL, Database), ResolvedPath);
        });
    } else {
        FS.copyFile(PathURL, ResolvedPath);
    }

    return ResolvedPath;
}

function Pathfinder () {

    const DatabaseHostName = PathURL.split("/")
    .filter(A => !!A).pop().split(".")[0];

    if (SnapshotIdx < Snapshots) {
        // Create a snapshot.
        const ResolvedBackupPath = Path.join(Destination, "Snapshots", DatabaseHostName);
        if (!FS.existsSync(ResolvedBackupPath)) FS.mkdir(ResolvedBackupPath, {recursive: true}, () => Backup(ResolvedBackupPath));
        else Backup(ResolvedBackupPath);
        return SnapshotIdx++;
    }

    // Build a full backup.
    Backup(Path.join(Destination, DatabaseHostName));
    return SnapshotIdx = 0;

}

setInterval(() => {
    if (!FS.existsSync(Destination))
    FS.mkdir(Destination, {recursive: true}, Pathfinder);
    else Pathfinder();
}, Interval);
