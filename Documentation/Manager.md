
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
new QDB.BackupManager("lib/Databases/", "/usr/local/backups/");
```

| Key | Type | Description |
| --- | --- | --- |
| PathURL | Pathlike | Path to the database file or directory to backup. |
| OptionsOrDest | RawOptions, Pathlike | The destination for the backups of the database(s). |



# Values
## [.Path](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Backups/Manager.js#L20)
> Path string to a directory or database file. [**Read Only**]
>
> Type **{Pathlike}**

## [.Destination](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Backups/Manager.js#L49)
> Path string to the destination of the backups. [**Read Only**]
>
> Type **{Pathlike}**
