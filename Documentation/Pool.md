
# Pool

* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Pool](https://github.com/QSmally/QDB/blob/v4/Documentation/Pool.md)

**Managers**
* [Backup Manager](https://github.com/QSmally/QDB/blob/v4/Documentation/Manager.md)

**Utilities**
* [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
* [Selection](https://github.com/QSmally/QDB/blob/v4/Documentation/Selection.md)
* [Schema](https://github.com/QSmally/QDB/blob/v4/Documentation/Schema.md)

A utility class for managing multiple database Connections.
```js
const myDBs = new QDB.Pool("/usr/Production/Cellar/");
```

| Key | Type | Description |
| --- | --- | --- |
| pathURL | Pathlike | Path to the database file or directory for this Pool to operate. |
| poolOptions? | PoolOptions | Options for this Pool to manage, including separate Connection options. |



# Values
## [.path](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Pool.js#L16)
> Path string to the Pool directory. [**Read Only**]
>
> Type **{Pathlike}**

## [.store](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Pool.js#L27)
> A collection of databases this Pool holds. [**Read Only**]
>
> Type **[{Collection}](https://github.com/QSmally/Qulity/blob/master/Documentation/Collection.md)**

## [.valOptions](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Pool.js#L39)
> Options for this Pool. [**Read Only**]
>
> Type **{PoolOptions}**

# Methods
## [.select(base)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Pool.js#L67)
> Retrieves a database Connection from this Pool instance.
> | Key | Type | Description |
> | --- | --- | --- |
> | base | String | Reference link to the Connection to resolve. |
>
> Returns **{Connection}** 

## [.disconnect()](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Pool.js#L78)
> Disconnects from all the Connections in this Pool.
>
> Returns **{Pool}** 

# Typedefs
## [PoolOptions](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Pool.js#L93)
> Options for a database Pool. All integer related options are in milliseconds. 
> | Key | Type | Description |
> | --- | --- | --- |
> | exclusives | Object<Identifier, RawOptions> | Non-default options to use for certain Connections to a database. |
> | binding | Boolean | Whether or not to automatically bind Schemas with the table names in the Pool. |
> | WAL | Boolean | Default setting to enable Write Ahead Logging mode for Connections in this Pool. |
> | cache | Boolean | Whether to enable in-memory caching of entries in results that the next retrieval would be much faster. |
> | utilCache | Boolean | Whether or not to cache entries while performing utility tasks, such as the Exists method. |
> | cacheMaxSize | Number | Amount to be considered the maximum size. If this threshold is hit, the cache will temporarily stop adding new entries. |
> | sweepInterval | Number | Integer to indicate at what interval to sweep the entries of the Connection's internal cache. |
> | sweepLifetime | Number | The minimum age of an entry in the cache to consider being sweepable after an interval. |
>
> Type **{Object}**
