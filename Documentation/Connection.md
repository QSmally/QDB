
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



# Values
## [.Pool](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L29)
> Whether this Connection is used in a pool.
>
> Type **{Pool|null}**

## [.ValOptions](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L36)
> Validated options for this Connection. [**Read Only**]
>
> Type **{Object}**

## [.Table](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L52)
> Table name for this Connection. [**Read Only**]
>
> Type **{String}**

# Methods
## [.Disconnect()](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L125)
> Disconnects from the database, clears in-memory rows.
>
> Returns **{PartialConnection}** 

## [.AsObject()](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L139)
> Converts this database to an Object. To use dotaccess, use `Fetch` instead.
>
> Returns **{Object}** An Object instance with the key/value pairs.

## [.ToInstance(Instance, Pathlike?, {...Any})](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L149)
> Converts this database, or a part of it using dotaccess, to any Map-form instance.
> | Key | Type | Description |
> | --- | --- | --- |
> | Instance | Function | Instance to be converted to. Should either be an instance of a Map or Set, and this can include extended classes like Collections and DataStores. |
> | Pathlike? | String | Optional dotaccess path pointing towards what to serialise. |
> | {...Any} |  | [Args] Additional arguments to pass on to the instance. |
>
> Returns **{Any}** The instance with the target as entries.

## [.ToDataStore(Pathlike?)](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L168)
> Converts this database, or a part of it using dotaccess, to a DataStore instance.
> | Key | Type | Description |
> | --- | --- | --- |
> | Pathlike? | String | Optional dotaccess path pointing towards what to serialise. |
>
> Returns **{DataStore}** A DataStore instance with the key/model pairs.

## [.ToIntegratedManager(Pathlike?, Holds?)](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L177)
> Converts this database, or a part of it using dotaccess, to a Manager instance.
> | Key | Type | Description |
> | --- | --- | --- |
> | Pathlike? | String | Optional dotaccess path pointing towards what to serialise. |
> | Holds? | Function | Given optional class for which instance this Manager is for. |
>
> Returns **{Manager}** A Manager instance with the key/model pairs.

## [.Set(KeyOrPath, Value)](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L260)
> Manages the elements of the database.
> | Key | Type | Description |
> | --- | --- | --- |
> | KeyOrPath | String | Specifies at what row to insert or replace the element at. Use dotaccess notation to edit in-depth values. |
> | Value | Object|Array|Any | Data to set into the row, at the location of the key or path. |
>
> Returns **{Connection}** Returns the updated database.

## [.Fetch(KeyOrPath, Cache?)](https://github.com/QSmally/QDB/blob/v4/lib/Connection.js#L281)
> Manages the retrieval of the database.
> | Key | Type | Description |
> | --- | --- | --- |
> | KeyOrPath | String | Specifies which row to fetch or get from cache. Use dotaccess notation to retrieve in-depth values. |
> | Cache? | Boolean | Whether to, when not already, cache this entry in results that the next retrieval would be much faster. |
>
> Returns **{Object|Array|Any}** Value of the row, or the property when using dotaccess.
