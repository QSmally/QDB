
# Pool

* [Start](https://github.com/QSmally/QDB/blob/v4/Documentation/Index.md)
* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Schema](https://github.com/QSmally/QDB/blob/v4/Documentation/Schema.md)
* [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
* [Selection](https://github.com/QSmally/QDB/blob/v4/Documentation/Selection.md)
* [Pool](https://github.com/QSmally/QDB/blob/v4/Documentation/Pool.md)
* [PartialConnection](https://github.com/QSmally/QDB/blob/v4/Documentation/PartialConnection.md)

A utility class for managing multiple database Connections.
```js
const MyDBs = new QDB.Pool("lib/Databases/");
```

| Key | Type | Description |
| --- | --- | --- |
| PathURL | Pathlike | Path to the database file or directory. |
| PoolOptions? | PoolOptions | Options for this Pool to manage, including separate Connection options. |



# Values
## [.Path](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Pool.js#L17)
> Path string to the Pool directory. [**Read Only**]
>
> Type **{Pathlike}**

## [.Databases](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Pool.js#L28)
> A collection of databases this Pool holds. [**Read Only**]
>
> Type **[{DataStore}](https://github.com/QSmally/Qulity/blob/master/Documentation/DataStore.md)**

## [.ValOptions](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Pool.js#L40)
> Options for this Pool. [**Read Only**]
>
> Type **{PoolOptions}**

# Methods
## [.$(Base)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Pool.js#L71)
> Retrieves a database Connection (or a ThreadProvider if this Pool is multithreaded).
> | Key | Type | Description |
> | --- | --- | --- |
> | Base | String | Reference link to the Connection to resolve. |
>
> Returns **{Connection|ThreadProvider}** 

# Typedefs
## [.PoolOptions](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Pool.js#L87)
> Options for a database Pool. All integer related options are in milliseconds. 
> | Key | Type | Description |
> | --- | --- | --- |
> | RawOptions>} | Object<Filename, | Exclusives Non-default options to use for certain Connections to a database. |
> | Threads | Boolean, Number | Whether to create a thread for each Connection, or an integer to indicate the amount of threads.  |
> | Table | String | A default table name for each Connection in this Pool. |
> | WAL | Boolean | Default setting to enable Write Ahead Logging mode for Connections in this Pool. |
> | Cache | Boolean | Whether to enable in-memory caching of entries in results that the next retrieval would be much faster. |
> | UtilCache | Boolean | Whether or not to cache entries while performing utility tasks, such as the Exists and Accumulate methods. |
> | SweepInterval | Number | Integer to indicate at what interval to sweep the entries of the Connection's internal cache. |
> | SweepLifetime | Number | The minimum age of an entry in the cache to consider being sweepable after an interval.  |
> | SnapshotLifetime | Number | After how many intervals to merge the latest snapshot backups into one. |
> | BackupInterval | Number | Integer to indicate at what interval to create a snapshot backup, or merge the snapshots. |
> | BackupDirectory | Pathlike | A path URL to the directory to insert all the database backups in. |
>
> Type **{Object}**
