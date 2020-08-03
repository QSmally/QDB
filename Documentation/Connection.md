
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

## [.Pool](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L61)
> Whether this Connection is used in a Pool.
>
> Type **{Pool|null}**

# Typedefs
## [.RawOptions](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L83)
> Options for a Connection.
> | Key | Type | Description |
> | --- | --- | --- |
> | Table | String | A name for the table to use at this path. |
> | Schema | Schema | Link to a database Schema for automatic migration. |
> | WAL | Boolean | Whether or not to enable Write Ahead Logging mode. |
> | Cache | Boolean | Whether to enable in-memory caching of entries. |
> | FetchAll | Boolean | Whether to fetch all database entries on start up. |
> | SweepInt | Number, Boolean | Integer to indicate at what interval to sweep the cache, or 'false'. |
> | SweepLife | Number, Boolean | Integer to mark the minimum lifetime of an entry to be swept, or 'false'. |
> | BackupInt | Number, Bollean | Interval to create a backup of the database, or 'false'. |
> | BackupDir | String, Boolean | Directory for the backups to be placed in, or 'false'. |
>
> Type **{Object}**
