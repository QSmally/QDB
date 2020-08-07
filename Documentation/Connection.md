
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

## [.Size](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L145)
> Fetches asll the rows of this database.
>
> Type **{Number}**

## [.CacheSize](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L156)
> Retrieves all the in-memory cached rows of this Connection. Extension of what would be `<Connection>.Cache.size`, but checks for the ready state.
>
> Type **{Number}**

# Methods
## [.get()](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L167)
> Retrieves all the keys of this database table.
>
> Returns **{Array}** Returns a list of indexes.

## [.Disconnect()](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L177)
> Disconnects from this Connection, clears in-memory rows. Only run this method when you are exiting the program, or want to fully disconnect from this database.
>
> Returns **{Connection}** 

## [.AsObject()](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L283)
> Converts this database's rows into an Object. To use dotaccess, use {@link Fetch} instead.
>
> Returns **{Object}** An object instance with the key/value pairs of this database.

## [.ToIntegratedManager(Pathlike?, Holds?)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L293)
> Converts this database, or a part of it using dotaccess, to a Manager instance.
> | Key | Type | Description |
> | --- | --- | --- |
> | Pathlike? | Pathlike | Optional dotaccess path pointing towards what to serialise. |
> | Holds? | Function | Given optional class for which instance this Manager is for. |
>
> Returns **{Manager}** A Manager instance with the key/model pairs.

## [.Set(KeyOrPath, Value)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L312)
> Manages the elements of the database.
> | Key | Type | Description |
> | --- | --- | --- |
> | KeyOrPath | Pathlike | Specifies at what row to insert or replace the element at. Use dotaccess notation to edit properties. |
> | Value | Object, Array, Any | Data to set at the row address, at the location of the key or path. |
>
> Returns **{Connection}** Returns the updated database.

## [.Fetch(KeyOrPath, Cache?)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L333)
> Manages the retrieval of the database.
> | Key | Type | Description |
> | --- | --- | --- |
> | KeyOrPath | Pathlike | Specifies which row to fetch or get from cache. Use dotaccess to retrieve properties. |
> | Cache? | Boolean | Whether to, if not already, cache this entry in results that the next retrieval would be much faster. |
>
> Returns **{Object|Array|DataModel|Any}** Value of the row, or the property when using dotaccess.

## [.Evict({...Pathlike})](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L359)
> Erases elements from this Connection's internal cache.
> | Key | Type | Description |
> | --- | --- | --- |
> | {...Pathlike} |  | [Keys] A key or multiple keys to remove from cache. If none, the cache will get cleared entirely. |
>
> Returns **{Connection}** Returns the updated database.

## [.Erase({...Pathlike})](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L373)
> Manages the deletion of the database.
> | Key | Type | Description |
> | --- | --- | --- |
> | {...Pathlike} |  | Keys A key or multiple keys to remove from the database. These elements will also get removed from this Connection's internal cache. |
>
> Returns **{Connection}** Returns the updated database.

# Typedefs
## [.RawOptions](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L394)
> Options for a database Connection. All integer related options are in milliseconds. 
> | Key | Type | Description |
> | --- | --- | --- |
> | Table | String | A name for the table to use at this path. |
> | Schema | Schema | Link to a database Schema class for automatic migration. |
> | WAL | Boolean | Whether or not to enable Write Ahead Logging mode.  |
> | Cache | Boolean | Whether to enable in-memory caching of entries in results that the next retrieval would be much faster. |
> | FetchAll | Boolean | Whether or not to fetch all the database entries on start-up of this Connection. |
> | SweepInterval | Number | Integer to indicate at what interval to sweep the entries of this Connection's internal cache. |
> | SweepLifetime | Number | The minimum age of an entry in the cache to consider being sweepable after an interval.  |
> | Backups | Boolean | Whether to enable database backups for this Connection's database. |
> | BackupInterval | Number | Integer to indicate at what interval to create a low-level backup. |
> | BackupLifetime | Number | After how many intervals to merge the latest low-level into one. |
> | BackupDirectory | Pathlike | A path URL to the directory to place all the backups in. |
>
> Type **{Object}**
