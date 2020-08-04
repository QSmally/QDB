
# Connection
### Extends **{BaseConnection}**

* [Start](https://github.com/QSmally/QDB/blob/v4/Documentation/Index.md)
* [PartialConnection](https://github.com/QSmally/QDB/blob/v4/Documentation/PartialConnection.md)
* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)

The main interface for interacting with QDB.
```js
const Users = new QDB.Connection("lib/Databases/Users.qdb");
```

> | Key | Type | Description |
> | --- | --- | --- |
> | PathURL | Pathlike | Path to the database file. |
> | RawOptions? | RawOptions | Options for this Connection. |
> | Pool? | Pool | Pool reference when this database was initialised in a Pool. |



# Values
## [.Path](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L28)
> Path string to the database. [**Read Only**]
>
> Type **{Pathlike}**

## [.ValOptions](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L39)
> Options for this Connection. [**Read Only**]
>
> Type **{RawOptions}**

## [.Pool](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L63)
> Whether this Connection is used in a Pool.
>
> Type **{Pool|null}**

## [.Table](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L73)
> Table name of this Connection. [**Read Only**]
>
> Type **{String}**

# Typedefs
## [.RawOptions](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L128)
> Options for a database Connection. All integer related options are in milliseconds. 
> | Key | Type | Description |
> | --- | --- | --- |
> | Table | String | A name for the table to use at this path. |
> | Schema | Schema | Link to a database Schema class for automatic migration. |
> | WAL | Boolean | Whether or not to enable Write Ahead Logging mode.  |
> | Cache | Boolean | Whether to enable in-memory caching of entries to make a second fetch much faster. |
> | FetchAll | Boolean | Whether to fetch all the database entries on start-up of this Connection. |
> | SweepInterval | Number | Integer to indicate at what interval to sweep the cache. |
> | SweepLifetime | Number | The minimum age of an entry cache to consider being sweepable.  |
> | Backups | Boolean | Whether to enable database backups for this Connection's database. |
> | BackupInterval | Number | Integer to indicate at what interval to create a low-level backup. |
> | BackupLifetime | Number | After how many intervals to merge the latest low-level into one. |
> | BackupDirectory | Pathlike | A path URL to the directory to place all the backups in. |
>
> Type **{Object}**
