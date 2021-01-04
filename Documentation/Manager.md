
# Manager

* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Pool](https://github.com/QSmally/QDB/blob/v4/Documentation/Pool.md)

**Managers**
* [Backup Manager](https://github.com/QSmally/QDB/blob/v4/Documentation/Manager.md)

**Utilities**
* [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
* [Selection](https://github.com/QSmally/QDB/blob/v4/Documentation/Selection.md)
* [Schema](https://github.com/QSmally/QDB/blob/v4/Documentation/Schema.md)

A utility class for creating backups of databases.
```js
new QDB.BackupManager("lib/Databases/", { Destination: "/usr/local/backups/" });
```

| Key | Type | Description |
| --- | --- | --- |
| PathURL | Pathlike | Path to the database file or directory to backup. |
| BackupOptions | BackupOptions | Options to use for this Backup Manager. |



# Values
## [.Path](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Backups/Manager.js#L18)
> Path string to a directory or database file. [**Read Only**]
>
> Type **{Pathlike}**

## [.Destination](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Backups/Manager.js#L45)
> Path string to the destination of the backups. [**Read Only**]
>
> Type **{Pathlike}**

# Typedefs
## [BackupOptions](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Backups/Manager.js#L67)
> Options for a Backup Manager. All integer related options are in milliseconds. 
> | Key | Type | Description |
> | --- | --- | --- |
> | Destination | String | Path to the directory where backups will be placed in. |
> | Interval | Number | A time interval for when copies of the database(s) will be created. |
> | SnapshotLtm: | Number | Maximum amount of snapshots to create until making a full backup. |
>
> Type **{Object}**
