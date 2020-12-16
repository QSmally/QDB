
# Connection
### Extends **{PartialConnection}**

* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Pool](https://github.com/QSmally/QDB/blob/v4/Documentation/Pool.md)

**Utilities**
* [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
* [Selection](https://github.com/QSmally/QDB/blob/v4/Documentation/Selection.md)
* [Schema](https://github.com/QSmally/QDB/blob/v4/Documentation/Schema.md)

The main interface for interacting with QDB.
```js
const Users = new QDB.Connection("lib/Databases/Users.qdb");
```

| Key | Type | Description |
| --- | --- | --- |
| PathURL | Pathlike | Path to the database file of this Connection. |
| RawOptions? | RawOptions | Options for this Connection. |



# Values
## [.Path](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L29)
> Path string to the database. [**Read Only**]
>
> Type **{Pathlike}**

## [.ValOptions](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L40)
> Options for this Connection. [**Read Only**]
>
> Type **{RawOptions}**

## [.Pool](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L68)
> Whether this Connection is used in a Pool. [**Read Only**]
>
> Type **{Pool?}**

## [.Table](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L79)
> Table name of this Connection. [**Read Only**]
>
> Type **{String}**

## [.Size](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L140)
> Retrieves all the rows of this Connection.
>
> Type **{Number}**

## [.CacheSize](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L151)
> Retrieves all the in-memory cached rows of this Connection. Extension of what would be `<Connection>.Cache.size`, but checks for the ready state.
>
> Type **{Number}**

## [.Indexes](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L162)
> Retrieves all the keys of this database table.
>
> Type **{Array}**

# Methods
## [.Disconnect()](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L173)
> Disconnects from this Connection, clears in-memory rows. Only run this method when you are exiting the program, or want to fully disconnect from this database.
>
> Returns **{Connection}** 

## [.AsObject()](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L274)
> Converts this database's rows into an Object. To use dotaccess, use `Fetch` instead.
>
> Returns **{Object}** An object instance with the key/value pairs of this database.

## [.ToIntegratedManager(Pathlike?, Holds?)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L284)
> Converts this database, or a part of it using dotaccess, to a Manager instance.
> | Key | Type | Description |
> | --- | --- | --- |
> | Pathlike? | Pathlike | Optional dotaccess path pointing towards what to serialise. |
> | Holds? | Function | Given optional class for which instance this Manager is for. |
>
> Returns **[{Manager}](https://github.com/QSmally/Qulity/blob/master/Documentation/Manager.md)** A Manager instance with the key/model pairs.

## [.Transaction()](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L301)
> Creates a SQL transaction, which allows you to commit or rollback changes.
>
> Returns **{Transaction?}** A Transaction instance, or a nil value when already in a transaction.

## [.Set(KeyOrPath, Value)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L314)
> Manages the elements of the database.
> | Key | Type | Description |
> | --- | --- | --- |
> | KeyOrPath | Pathlike | Specifies at what row to insert or replace the element at. Use dotaccess notation to edit properties. |
> | Value | Object, Array, DataModel, Any | Data to set at the row address, at the location of the key or path. |
>
> Returns **{Connection}** Returns the updated database.

## [.Fetch(KeyOrPath, Cache?)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L337)
> Manages the retrieval of the database.
> | Key | Type | Description |
> | --- | --- | --- |
> | KeyOrPath | Pathlike | Specifies which row to fetch or get from cache. Use dotaccess to retrieve properties. |
> | Cache? | Boolean | Whether to, if not already, cache this entry in results that the next retrieval would be much faster. |
>
> Returns **{Object|Array|DataModel|Any}** Value of the row, or the property when using dotaccess.

## [.Evict(Keys?)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L364)
> Erases elements from this Connection's internal cache.
> | Key | Type | Description |
> | --- | --- | --- |
> | Keys? | ...Pathlike | A key or multiple keys to remove from cache. If none, the cache will get cleared entirely. |
>
> Returns **{Connection}** Returns the updated database.

## [.Erase(Keys)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L381)
> Manages the deletion of the database.
> | Key | Type | Description |
> | --- | --- | --- |
> | Keys | ...Pathlike | A key or multiple keys to remove from the database. These elements will also get removed from this Connection's internal cache. |
>
> Returns **{Connection}** Returns the updated database.

## [.Exists(Key, Cache?)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L407)
> Returns whether or not a row in this database exists. This method also caches the row internally, so fetching it afterwards would be much faster.
> | Key | Type | Description |
> | --- | --- | --- |
> | Key | Pathlike | Specifies which row to see if it exists. |
> | Cache? | Boolean | Whether or not to cache the fetched entry. |
>
> Returns **{Boolean}** Whether or not a row exists in this database.

## [.Each(Fn)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L421)
> Iterates through this database's entries.
> | Key | Type | Description |
> | --- | --- | --- |
> | Fn | Function | A function which passes on the iterating entries. |
>
> Returns **{Connection}** Returns the current Connection.

## [.Find(Fn)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L436)
> Iterates through all the entries of the database, returns the first element found.
> | Key | Type | Description |
> | --- | --- | --- |
> | Fn | Function | A tester function which returns a boolean, based on the value(s) of the rows. |
>
> Returns **{Object|Array|DataModel}** Returns the row which was found, or a nil value.

## [.Select(FnOrPath)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L457)
> Locally filters out rows in memory to work with. Please note that this method does increase memory usage in large databases.
> | Key | Type | Description |
> | --- | --- | --- |
> | FnOrPath | Function, Pathlike | A filter function which returns a boolean, or a row in the database. |
>
> Returns **{Selection}** A Selection class instance.

## [.Push(KeyOrPath, Values)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L485)
> Pushes something to an array at the path output.
> | Key | Type | Description |
> | --- | --- | --- |
> | KeyOrPath | Pathlike | Specifies which row or nested array to push to. |
> | Values | ...Any | Values to insert and push to this array. |
>
> Returns **{Number}** New length of the array.

## [.Shift(KeyOrPath, Values?)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L504)
> Inserts (if defined) or removes a value to/from the front of the array.
> | Key | Type | Description |
> | --- | --- | --- |
> | KeyOrPath | Pathlike | Specifies which row or nested array to insert to/remove from. |
> | Values? | ...Any | If defined, inserts new values at the front of the array. |
>
> Returns **{Number|Any}** New length of the array if a value was inserted, or the shifted value.

## [.Pop(KeyOrPath)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L527)
> Pops something from an array at the path output.
> | Key | Type | Description |
> | --- | --- | --- |
> | KeyOrPath | Pathlike | Specifies which row or nested array to pop from. |
>
> Returns **{Any}** Returns the popped value.

## [.Remove(KeyOrPath, Fn)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L544)
> Removes a specific element from this endpoint array.
> | Key | Type | Description |
> | --- | --- | --- |
> | KeyOrPath | Pathlike | Specifies which row or nested array to remove a value from. |
> | Fn | Function | A function that returns a boolean to which value to remove. |
>
> Returns **{Number}** New length of the array.

## [.Slice(KeyOrPath, Start?, End?)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L568)
> Removes elements from this endpoint array based on indexes.
> | Key | Type | Description |
> | --- | --- | --- |
> | KeyOrPath | Pathlike | Specifies which row or nested array to slice values from. |
> | Start? | Number | Beginning of the specified portion of the array. |
> | End? | Number | End of the specified portion of the array. |
>
> Returns **{Number}** New length of the array.

## [.Ensure(KeyOrPath, Input, Merge?)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L590)
> Inserts an input into a row or nested object if the key or path wasn't found at the endpoint. It can be used as a default schema of the database elements, that gets inserted if there's no entry already.
> | Key | Type | Description |
> | --- | --- | --- |
> | KeyOrPath | Pathlike | Context key to see if it exists, either a row or nested property, and optionally insert the new value. |
> | Input | Object, Array, Schema, Any | A value to input if the row or nested property wasn't found in the database. |
> | Merge? | Boolean | Whether or not to merge `Input` with this Connection's Schema model as initial values. |
>
> Returns **{Boolean}** Whether or not the new value was inserted.

## [.Modify(KeyOrPath, Fn)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L616)
> Updates a value in the database by fetching it and passing it onto the callback function.
> | Key | Type | Description |
> | --- | --- | --- |
> | KeyOrPath | Pathlike | Specifies which row or nested property to fetch. |
> | Fn | Function | Callback which includes the original value of the fetched row or property. |
>
> Returns **{Object|Array|DataModel}** Returns the new row of the updated property.

## [.Invert(KeyOrPath)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L634)
> Inverts a boolean, from true to false and vice-versa, at the endpoint of the path.
> | Key | Type | Description |
> | --- | --- | --- |
> | KeyOrPath | Pathlike | Specifies which row or nested property to boolean-invert. |
>
> Returns **{Boolean}** Returns the updated boolean value of the property.

# Typedefs
## [RawOptions](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L655)
> Options for a database Connection. All integer related options are in milliseconds. 
> | Key | Type | Description |
> | --- | --- | --- |
> | Table | String | A name for the table to use at this path for this Connection. |
> | Schema | Schema | Link to a database Schema class for automatic data migration. |
> | WAL | Boolean | Whether or not to enable Write Ahead Logging mode. |
> | Cache | Boolean | Whether to enable in-memory caching of entries in results that the next retrieval would be much faster. |
> | FetchAll | Boolean | Whether or not to fetch all the database entries on start-up of this database Connection. |
> | UtilCache | Boolean | Whether or not to cache entries while performing utility tasks, such as the Exists method. |
> | CacheMaxSize | Number | Amount to be considered the maximum size. If this threshold is hit, the cache will temporarily stop adding new entries. |
> | SweepInterval | Number | Integer to indicate at what interval to sweep the entries of this Connection's internal cache. |
> | SweepLifetime | Number | The minimum age of an entry in the cache to consider being sweepable after an interval. |
> | SnapshotLifetime | Number | After how many intervals to merge the latest snapshot backups into one. |
> | BackupInterval | Number | Integer to indicate at what interval to create a snapshot backup, or merge the snapshots. |
> | BackupDirectory | Pathlike | A path URL to the directory to insert all the database backups in. |
>
> Type **{Object}**

## [DataModel](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L677)
> An entry which has been resolved from the Connection's internal cache.
> | Key | Type | Description |
> | --- | --- | --- |
> | _DataStore | String | Identifier of this model. |
> | _Timestamp | Number | Date when this entry was last patched, used for sweeping of the cache. |
>
> Type **{Object|Array}**

## [Pathlike](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L684)
> Path string to navigate entries of the database.
>
> Type **{String}**
