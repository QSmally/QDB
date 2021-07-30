
# Manager
### Extends **{EventEmitter}**

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
new QDB.BackupManager("../Cellar/", { destination: "/usr/local/backups/" });
```

| Key | Type | Description |
| --- | --- | --- |
| pathURL | Pathlike | Path to the database file or directory to backup. |
| backupOptions | BackupOptions | Options to use for this Backup Manager. |



# Values
## [.path](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Backups/Manager.js#L22)
> Path string to a directory or database file. [**Read Only**]
>
> Type **{Pathlike}**

## [.destination](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Backups/Manager.js#L51)
> Path string to the destination of the backups. [**Read Only**]
>
> Type **{Pathlike}**

# Methods
## [.on(event, listener)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Backups/Manager.js#L93)
> Registers an event listener on one of this Manager's events.
> | Key | Type | Description |
> | --- | --- | --- |
> | event | String | Which action to register for the listener. |
> | listener | Function | Function to execute upon this event. |
>
> Returns **{BackupManager}** 

## [.spawn()](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Backups/Manager.js#L104)
> Spawns the child process for this Manager.
>
> Returns **{BackupManager}** 

## [.exit()](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Backups/Manager.js#L131)
> Ends the backup process and emits the `exit` event.
>
> Returns **{BackupManager}** 

# Typedefs
## [BackupOptions](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Backups/Manager.js#L145)
> Options for a Backup Manager. All integer related options are in milliseconds. 
> | Key | Type | Description |
> | --- | --- | --- |
> | retry | Boolean | Whether or not to retry spawning this Manager's child process if it exits with a non-zero code. |
> | destination | String | Path to the directory where backups will be placed in. |
> | interval | Number | A time interval for when copies of the database(s) will be created. |
> | snapshots | Number | Maximum amount of snapshots to create until making a full backup. |
>
> Type **{Object}**

## [BackupEvents](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Backups/Manager.js#L157)
> Events related to the BackupManager, registered by `manager.on(...);`. 
> | Key | Type | Description |
> | --- | --- | --- |
> | spawn | Timestamp | Fired upon a new child process being created for this Manager. |
> | exit | Number | Executed with the status code as argument of the function. |
> | error | Error | Fired when the child process encountered an error. |
> | debug | String | Any message from the backup process with information about its state. |
>
> Type **{Events}**
