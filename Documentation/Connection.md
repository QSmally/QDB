
# Connection
### Extends **{BaseConnection}**

* [Start](https://github.com/QSmally/QDB/blob/v4/Documentation/Index.md)
* [BaseConnection](https://github.com/QSmally/QDB/blob/v4/Documentation/BaseConnection.md)
* [PartialConnection](https://github.com/QSmally/QDB/blob/v4/Documentation/PartialConnection.md)
* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Types](https://github.com/QSmally/QDB/blob/v4/Documentation/Types.md)

The main interface for interacting with QDB.
```js
const MyDB = new QDB.Connection("lib/Databases/Users.qdb");
```

> | Key | Type | Description |
> | --- | --- | --- |
> | PathURL | Pathlike | Path to the database file. |
> | RawOptions? | RawOptions | Options for this Connection. |
> | Pool? | Pool | Pool reference when this database was initialised in a Pool. |



# Values
## [.Pool](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L29)
> Whether this Connection is used in a pool.
>
> Type **{Pool|null}**

## [.ValOptions](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L36)
> Validated options for this Connection. [**Read Only**]
>
> Type **{RawOptions}**

## [.Table](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L53)
> Table name for this Connection. [**Read Only**]
>
> Type **{String}**

## [.Size](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L120)
> Fetches all the rows of this database.
>
> Type **{Number}**

## [.CacheSize](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L130)
> Retrieves all the in-memory cached rows of this Connection. Extension of what would be `<Connection>.Cache.size`, but checks for the ready state.
>
> Type **{Number}**

# Methods
## [.Disconnect()](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L141)
> Disconnects from the database, clears in-memory rows.
>
> Returns **{PartialConnection}** 

## [.AsObject()](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L159)
> Converts this database to an Object. To use dotaccess, use `Fetch` instead.
>
> Returns **{Object}** An Object instance with the key/value pairs.

## [.ToInstance(Instance, Pathlike?, Args?)](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L169)
> Converts this database, or a part of it using dotaccess, to any Map-form instance.
> | Key | Type | Description |
> | --- | --- | --- |
> | Instance | Function | Instance to be converted to. Should either be an instance of a Map or Set, and this can include extended classes like Collections and DataStores. |
> | Pathlike? | String | Optional dotaccess path pointing towards what to serialise. |
> | Args? | ...Any | Additional arguments to pass on to the instance. |
>
> Returns **{Any}** The instance with the target as entries.

## [.ToDataStore(Pathlike?)](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L188)
> Converts this database, or a part of it using dotaccess, to a DataStore instance.
> | Key | Type | Description |
> | --- | --- | --- |
> | Pathlike? | String | Optional dotaccess path pointing towards what to serialise. |
>
> Returns **{DataStore}** A DataStore instance with the key/model pairs.

## [.ToIntegratedManager(Pathlike?, Holds?)](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L197)
> Converts this database, or a part of it using dotaccess, to a Manager instance.
> | Key | Type | Description |
> | --- | --- | --- |
> | Pathlike? | String | Optional dotaccess path pointing towards what to serialise. |
> | Holds? | Function | Given optional class for which instance this Manager is for. |
>
> Returns **{Manager}** A Manager instance with the key/model pairs.

## [.Set(KeyOrPath, Value)](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L293)
> Manages the elements of the database.
> | Key | Type | Description |
> | --- | --- | --- |
> | KeyOrPath | String | Specifies at what row to insert or replace the element at. Use dotaccess notation to edit in-depth values. |
> | Value | Object, Array, Any | Data to set into the row, at the location of the key or path. |
>
> Returns **{Connection}** Returns the updated database.

## [.Fetch(KeyOrPath, Cache?)](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L314)
> Manages the retrieval of the database.
> | Key | Type | Description |
> | --- | --- | --- |
> | KeyOrPath | String | Specifies which row to fetch or get from cache. Use dotaccess notation to retrieve in-depth values. |
> | Cache? | Boolean | Whether to, when not already, cache this entry in results that the next retrieval would be much faster. |
>
> Returns **{Object|Array|DataModel|Any}** Value of the row, or the property when using dotaccess.

## [.Evict(Keys?)](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L340)
> Removes elements from this Connection's cache.
> | Key | Type | Description |
> | --- | --- | --- |
> | Keys? | ...String | A key or multiple keys to remove from the cache. If none, the cache will get cleared entirely. |
>
> Returns **{Connection}** Returns the updated database.

## [.Erase(Keys)](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L352)
> Removes elements from this database.
> | Key | Type | Description |
> | --- | --- | --- |
> | Keys | ...String | A key or multiple keys to remove from the database. These elements will also get removed from this Connection's internal cache. |
>
> Returns **{Connection}** Returns the updated database.
