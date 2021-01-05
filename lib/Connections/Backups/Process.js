
const FS   = require("fs");
const Path = require("path");

const {
    PathURL, Destination, Interval, Snapshots
} = process.env;

const Nop = () => {};
let SnapshotIdx = 0;


function Backup (ResolvedPath, IsDirectory) {
    const EndpointPath = Path.join(ResolvedPath, new Date().toISOString());

    try {
        if (IsDirectory) {
            FS.mkdirSync(EndpointPath);
            FS.readdirSync(PathURL).forEach(Database => {
                const Source = Path.join(PathURL, Database);
                const Destination = Path.join(EndpointPath, Database);
                FS.copyFile(Source, Destination, Nop);
            });
        } else {
            const Destination = `${EndpointPath}.qdb`;
            FS.copyFile(PathURL, Destination, Nop);
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

    const IsDirectory        = FS.lstatSync(PathURL).isDirectory();
    const Middleware         = SnapshotIdx < Snapshots ? "Snapshots" : "";
    const ResolvedBackupPath = Path.resolve(Destination, Middleware, DatabaseHostName);

    SnapshotIdx = SnapshotIdx < Snapshots ? (SnapshotIdx + 1) : 0;

    if (!FS.existsSync(ResolvedBackupPath))
    FS.mkdir(ResolvedBackupPath, {recursive: true}, () => Backup(ResolvedBackupPath, IsDirectory));
    else Backup(ResolvedBackupPath, IsDirectory);

}

setInterval(() => {
    if (!FS.existsSync(Destination))
    FS.mkdir(Destination, {recursive: true}, Pathfinder);
    else Pathfinder();
}, Interval);
