
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
new QDB.BackupManager("lib/Databases/", { Destination: "/usr/local/backups/" });
```

| Key | Type | Description |
| --- | --- | --- |
| PathURL | Pathlike | Path to the database file or directory to backup. |
| BackupOptions | BackupOptions | Options to use for this Backup Manager. |



# Values
## [.Path](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Backups/Manager.js#L23)
> Path string to a directory or database file. [**Read Only**]
>
> Type **{Pathlike}**

## [.Destination](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Backups/Manager.js#L52)
> Path string to the destination of the backups. [**Read Only**]
>
> Type **{Pathlike}**

# Methods
## [.On(Event, Listener)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Backups/Manager.js#L94)
> Registers an event listener on one of this Manager's events.
> | Key | Type | Description |
> | --- | --- | --- |
> | Event | String | Which action to register for the listener. |
> | Listener | Function | Function to execute upon this event. |
>
> Returns **{BackupManager}** 

## [.Spawn()](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Backups/Manager.js#L105)
> Spawns the child processor for this Manager.
>
> Returns **{BackupManager}** 

# Typedefs
## [BackupOptions](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Backups/Manager.js#L137)
> Options for a Backup Manager. All integer related options are in milliseconds. 
> | Key | Type | Description |
> | --- | --- | --- |
> | Respawn | Boolean | Whether or not to retry spawning this Manager's child process if it exits with a non-zero code. |
> | Destination | String | Path to the directory where backups will be placed in. |
> | Interval | Number | A time interval for when copies of the database(s) will be created. |
> | Snapshots | Number | Maximum amount of snapshots to create until making a full backup. |
>
> Type **{Object}**

## [BackupEvents](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Backups/Manager.js#L149)
> Events related to the BackupManager, registered by `Manager.On(...);`. 
> | Key | Type | Description |
> | --- | --- | --- |
> | Spawn | Timestamp | Fired upon a new child process being created for this Manager. |
> | Exit | Number | Executed with the status code as argument of the function. |
> | Error | Error | Fired when the child process encountered an error. |
> | Debug | String | Any message from the backup process with information about its state. |
>
> Type **{Events}**
