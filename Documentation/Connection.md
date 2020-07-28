
# Connection
### Extends **{BaseConnection}**

* [Start](https:/github.com/QSmally/Docgen/blob/v4/Documentation/Index.md)
* [BaseConnection](https:/github.com/QSmally/Docgen/blob/v4/Documentation/BaseConnection.md)
* [PartialConnection](https:/github.com/QSmally/Docgen/blob/v4/Documentation/PartialConnection.md)
* [Connection](https:/github.com/QSmally/Docgen/blob/v4/Documentation/Connection.md)

The main interface for interacting with QDB.
```js
const MyDB = new QDB.Connection("lib/Databases/Users.qdb");
```



# Values
## [.Pool](https:/github.com/QSmally/Docgen/blob/v4/Documentation/Connection.js#L29)
> Whether this Connection is used in a pool.
>
> Type **{Pool|null}**

## [.ValOptions](https:/github.com/QSmally/Docgen/blob/v4/Documentation/Connection.js#L36)
> Validated options for this Connection. [**Read Only**]
>
> Type **{Object}**

## [.Table](https:/github.com/QSmally/Docgen/blob/v4/Documentation/Connection.js#L52)
> Table name for this Connection. [**Read Only**]
>
> Type **{String}**



# Methods
## [.get()](https:/github.com/QSmally/Docgen/blob/v4/Documentation/Connection.js#L104)
> Fetches all the rows of this database.
>
> Returns **{Number}** 

## [.get()](https:/github.com/QSmally/Docgen/blob/v4/Documentation/Connection.js#L113)
> Retrieves all the in-memory cached rows of this Connection. Extension of what would be `<Connection>.Cache.size`, but checks for the ready state.
>
> Returns **{Number}** 

## [.Disconnect()](https:/github.com/QSmally/Docgen/blob/v4/Documentation/Connection.js#L123)
> Disconnects from the database, clears in-memory rows.
>
> Returns **{PartialConnection}** 

## [.AsObject()](https:/github.com/QSmally/Docgen/blob/v4/Documentation/Connection.js#L137)
> Converts this database to an Object. To use dotaccess, use `Fetch` instead.
>
> Returns **{Object}** An Object instance with the key/value pairs.

## [.ToInstance(Instance, Pathlike?, {...Any})](https:/github.com/QSmally/Docgen/blob/v4/Documentation/Connection.js#L147)
> Converts this database, or a part of it using dotaccess, to any Map-form instance.
> | Key | Type | Description |
> | --- | --- | --- |
> | Instance | Function | Instance to be converted to. Should either be an instance of a Map or Set, and this can include extended classes like Collections and DataStores. |
> | Pathlike? | String | Optional dotaccess path pointing towards what to serialise. |
> | {...Any} |  | [Args] Additional arguments to pass on to the instance. |
>
> Returns **{Any}** The instance with the target as entries.

## [.ToDataStore(Pathlike?)](https:/github.com/QSmally/Docgen/blob/v4/Documentation/Connection.js#L166)
> Converts this database, or a part of it using dotaccess, to a DataStore instance.
> | Key | Type | Description |
> | --- | --- | --- |
> | Pathlike? | String | Optional dotaccess path pointing towards what to serialise. |
>
> Returns **{DataStore}** A DataStore instance with the key/model pairs.

## [.ToIntegratedManager(Pathlike?, Holds?)](https:/github.com/QSmally/Docgen/blob/v4/Documentation/Connection.js#L175)
> Converts this database, or a part of it using dotaccess, to a Manager instance.
> | Key | Type | Description |
> | --- | --- | --- |
> | Pathlike? | String | Optional dotaccess path pointing towards what to serialise. |
> | Holds? | Function | Given optional class for which instance this Manager is for. |
>
> Returns **{Manager}** A Manager instance with the key/model pairs.

## [.Set(KeyOrPath, Value)](https:/github.com/QSmally/Docgen/blob/v4/Documentation/Connection.js#L257)
> Manages the elements of the database.
> | Key | Type | Description |
> | --- | --- | --- |
> | KeyOrPath | String | Specifies at what row to insert or replace the element at. Use dotaccess notation to edit in-depth values. |
> | Value | Object|Array|Any | Data to set into the row, at the location of the key or path. |
>
> Returns **{Connection}** Returns the updated database.

## [.Fetch(KeyOrPath, Cache?)](https:/github.com/QSmally/Docgen/blob/v4/Documentation/Connection.js#L278)
> Manages the retrieval of the database.
> | Key | Type | Description |
> | --- | --- | --- |
> | KeyOrPath | String | Specifies which row to fetch or get from cache. Use dotaccess notation to retrieve in-depth values. |
> | Cache? | Boolean | Whether to, when not already, cache this entry in results that the next retrieval would be much faster. |
>
> Returns **{Object|Array|Any}** Value of the row, or the property when using dotaccess.