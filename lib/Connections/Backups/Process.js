
const FS   = require("fs");
const Path = require("path");

const {
    PathURL, Destination, Interval, Snapshots
} = process.env;

const Nop = () => {};
let SnapshotIdx = 0;


function Backup (ResolvedPath) {
    const EndpointPath = Path.join(ResolvedPath, new Date().toISOString());

    try {
        if (FS.lstatSync(PathURL).isDirectory()) {
            FS.readdirSync(PathURL).forEach(Database => {
                FS.copyFile(Path.join(PathURL, Database), EndpointPath, Nop);
            });
        } else {
            const FileEndpoint = `${EndpointPath}.qdb`;
            FS.copyFile(PathURL, FileEndpoint, Nop);
        }
    } catch (Err) {
        console.error(Err);
    } finally {
        return EndpointPath;
    }
}

function Pathfinder () {

    const DatabaseHostName = PathURL.split("/")
    .filter(A => !!A).pop().split(".")[0];

    const Middleware = SnapshotIdx < Snapshots ? "Snapshots" : "";
    const ResolvedBackupPath = Path.resolve(Destination, Middleware, DatabaseHostName);
    SnapshotIdx = SnapshotIdx < Snapshots ? (SnapshotIdx + 1) : 0;

    if (!FS.existsSync(ResolvedBackupPath))
    FS.mkdir(ResolvedBackupPath, {recursive: true}, () => Backup(ResolvedBackupPath));
    else Backup(ResolvedBackupPath);

}

setInterval(() => {
    if (!FS.existsSync(Destination))
    FS.mkdir(Destination, {recursive: true}, Pathfinder);
    else Pathfinder();
}, Interval);
