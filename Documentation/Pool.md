
# Pool

* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Pool](https://github.com/QSmally/QDB/blob/v4/Documentation/Pool.md)

**Utilities**
* [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
* [Selection](https://github.com/QSmally/QDB/blob/v4/Documentation/Selection.md)
* [Schema](https://github.com/QSmally/QDB/blob/v4/Documentation/Schema.md)

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

## [.Store](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Pool.js#L28)
> A collection of databases this Pool holds. [**Read Only**]
>
> Type **[{DataStore}](https://github.com/QSmally/Qulity/blob/master/Documentation/DataStore.md)**

## [.ValOptions](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Pool.js#L40)
> Options for this Pool. [**Read Only**]
>
> Type **{PoolOptions}**

# Methods
## [.Select(Base)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Pool.js#L84)
> Retrieves a database Connection from this Pool instance.
> | Key | Type | Description |
> | --- | --- | --- |
> | Base | String | Reference link to the Connection to resolve. |
>
> Returns **{Connection}** 

## [.Disconnect()](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Pool.js#L94)
> Disconnects from all the Connections or Gateways in this Pool. When threaded, this Pool exits the thread asynchronously.
>
> Returns **{Pool}** 

# Typedefs
## [PoolOptions](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Pool.js#L115)
> Options for a database Pool. All integer related options are in milliseconds. 
> | Key | Type | Description |
> | --- | --- | --- |
> | Exclusives | Object<Identifier, RawOptions> | Non-default options to use for certain Connections to a database. |
> | WAL | Boolean | Default setting to enable Write Ahead Logging mode for Connections in this Pool. |
> | Cache | Boolean | Whether to enable in-memory caching of entries in results that the next retrieval would be much faster. |
> | UtilCache | Boolean | Whether or not to cache entries while performing utility tasks, such as the Exists and Accumulate methods. |
> | IterCache | Boolean | Whether to cache iterating entries while performing utility tasks, like the Each and Select methods. |
> | CacheMaxSize | Number | Amount to be considered the maximum size. If this threshold is hit, it will remove old entries from the cache. |
> | SweepInterval | Number | Integer to indicate at what interval to sweep the entries of the Connection's internal cache. |
> | SweepLifetime | Number | The minimum age of an entry in the cache to consider being sweepable after an interval. |
> | BackupInterval | Number | Integer to indicate at what interval to create a backup at. |
> | BackupDirectory | Pathlike | A path URL to the directory to insert all the database backups in. |
>
> Type **{Object}**
