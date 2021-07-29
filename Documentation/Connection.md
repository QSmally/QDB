
# Connection

* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Pool](https://github.com/QSmally/QDB/blob/v4/Documentation/Pool.md)

**Managers**
* [Backup Manager](https://github.com/QSmally/QDB/blob/v4/Documentation/Manager.md)

**Utilities**
* [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
* [Selection](https://github.com/QSmally/QDB/blob/v4/Documentation/Selection.md)
* [Schema](https://github.com/QSmally/QDB/blob/v4/Documentation/Schema.md)

The main interface for interacting with QDB.
```js
const users = new QDB.Connection("../Cellar/Users.qdb");
```

| Key | Type | Description |
| --- | --- | --- |
| pathURL | Pathlike | Path to the database file of this Connection. |
| rawOptions? | RawOptions | Options for this Connection. |



# Values
## [.state](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L20)
> Current state of this Connection. [**Read Only**]
>
> Type **{String}**

## [.path](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L32)
> Path string to the database. [**Read Only**]
>
> Type **{Pathlike}**

## [.valOptions](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L43)
> Options for this Connection. [**Read Only**]
>
> Type **{RawOptions}**

## [.poolController](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L67)
> Reference to the Pool this Connection was created in. [**Read Only**]
>
> Type **{Pool?}**

## [.table](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L78)
> Table name of this Connection. [**Read Only**]
>
> Type **{String}**

## [.size](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L143)
> Retrieves all the rows of this Connection.
>
> Type **{Number}**

## [.cacheSize](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L155)
> Retrieves all the in-memory cached rows of this Connection. Extension of what would be `<Connection>.memory.size`, but checks for the ready state.
>
> Type **{Number}**

## [.indexes](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L166)
> Retrieves all the keys of this database table.
>
> Type **{Array}**

# Methods
## [.disconnect()](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L179)
> Disconnects from this Connection, clears in-memory rows. Only run this method when you are exiting the program, or want to fully disconnect from this database.
>
> Returns **{Connection}** 

## [.asObject()](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L283)
> Converts this database's rows into an Object. To use dotaccess, use `fetch` instead.
>
> Returns **{Object}** An object instance with the key/value pairs of this database.

## [.toIntegratedManager(pathlike?, holds?)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L296)
> Converts this database, or a part of it using dotaccess, to a Manager instance.
> | Key | Type | Description |
> | --- | --- | --- |
> | pathlike? | Pathlike | Optional dotaccess path pointing towards what to serialise. |
> | holds? | Function | Given optional class for which instance this Manager is for. |
>
> Returns **[{Manager}](https://github.com/QSmally/Qulity/blob/master/Documentation/BaseManager.md)** A Manager instance with the key/model pairs.

## [.transaction()](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L317)
> Creates a SQL transaction, which allows you to commit or rollback changes.
>
> Returns **{Transaction?}** A Transaction instance, or a nil value when already in a transaction.

## [.set(keyOrPath, document)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L330)
> Manages the elements of the database.
> | Key | Type | Description |
> | --- | --- | --- |
> | keyOrPath | Pathlike | Specifies at what row to insert or replace the element at. Use dotaccess notation to edit properties. |
> | document | Object, Array, DataModel, Any | Data to set at the row address, at the location of the key or path. |
>
> Returns **{Connection}** Returns the current Connection.

## [.fetch(keyOrPath, cache?)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L354)
> Manages the retrieval of the database.
> | Key | Type | Description |
> | --- | --- | --- |
> | keyOrPath | Pathlike | Specifies which row to fetch or get from cache. Use dotaccess to retrieve properties. |
> | cache? | Boolean | Whether to, if not already, cache this entry in results that the next retrieval would be much faster. |
>
> Returns **{Object|Array|DataModel|Any}** Value of the row, or the property when using dotaccess.

## [.evict(keys?)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L382)
> Erases elements from this Connection's internal cache.
> | Key | Type | Description |
> | --- | --- | --- |
> | keys? | ...Pathlike | A key or multiple keys to remove from cache. If none, the cache will get cleared entirely. |
>
> Returns **{Connection}** Returns the current Connection.

## [.erase(keys)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L400)
> Manages the deletion of the database.
> | Key | Type | Description |
> | --- | --- | --- |
> | keys | ...Pathlike | A key or multiple keys to remove from the database. These elements will also get removed from this Connection's internal cache. |
>
> Returns **{Connection}** Returns the current Connection.

## [.exists(key, cache?)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L427)
> Returns whether or not a row in this database exists. This method also caches the row internally, so fetching it afterwards would be much faster.
> | Key | Type | Description |
> | --- | --- | --- |
> | key | Pathlike | Specifies which row to see if it exists. |
> | cache? | Boolean | Whether or not to cache the fetched entry. |
>
> Returns **{Boolean}** Whether or not a row exists in this database.

## [.each(method)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L442)
> Iterates through this database's entries.
> | Key | Type | Description |
> | --- | --- | --- |
> | method | Function | A function which passes on the iterating entries. |
>
> Returns **{Connection}** Returns the current Connection.

## [.find(predicate)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L457)
> Iterates through all the entries of the database, returns the first element found.
> | Key | Type | Description |
> | --- | --- | --- |
> | predicate | Function | A tester function which returns a boolean, based on the value(s) of the rows. |
>
> Returns **{Object|Array|DataModel}** Returns the row which was found, or a nil value.

## [.select(predicateOrPath)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L483)
> Locally filters out rows in memory to work with. Please note that this method does increase memory usage in large databases.
> | Key | Type | Description |
> | --- | --- | --- |
> | predicateOrPath | Function, Pathlike | A filter function or a path to a row. |
>
> Returns **{Selection}** A Selection class instance.

## [.push(keyOrPath, values)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L513)
> Pushes something to an array at the path output.
> | Key | Type | Description |
> | --- | --- | --- |
> | keyOrPath | Pathlike | Specifies which row or nested array to push to. |
> | values | ...Any | Values to insert and push to this array. |
>
> Returns **{Number}** New length of the array.

## [.shift(keyOrPath, values?)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L532)
> Inserts (if defined) or removes a value to/from the front of the array.
> | Key | Type | Description |
> | --- | --- | --- |
> | keyOrPath | Pathlike | Specifies which row or nested array to insert to/remove from. |
> | values? | ...Any | If defined, inserts new values at the front of the array. |
>
> Returns **{Number|Any}** New length of the array if a value was inserted, or the shifted value.

## [.pop(keyOrPath)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L558)
> Pops something from an array at the path output.
> | Key | Type | Description |
> | --- | --- | --- |
> | keyOrPath | Pathlike | Specifies which row or nested array to pop from. |
>
> Returns **{Any}** Returns the popped value.

## [.remove(keyOrPath, predicateOrIdx)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L575)
> Removes a specific element from this endpoint array.
> | Key | Type | Description |
> | --- | --- | --- |
> | keyOrPath | Pathlike | Specifies which row or nested array to remove a value from. |
> | predicateOrIdx | Function, Number | Function or an index that specifies which item to remove. |
>
> Returns **{Number}** New length of the array.

## [.slice(keyOrPath, startIdx?, endIdx?)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L603)
> Removes elements from this endpoint array based on indexes.
> | Key | Type | Description |
> | --- | --- | --- |
> | keyOrPath | Pathlike | Specifies which row or nested array to slice values from. |
> | startIdx? | Number | Beginning of the specified portion of the array. |
> | endIdx? | Number | End of the specified portion of the array. |
>
> Returns **{Number}** New length of the array.

## [.ensure(keyOrPath, input, merge?)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L625)
> Inserts an input into a row or nested object if the key or path wasn't found at the endpoint. It can be used as a default schema of the database elements, that gets inserted if there's no entry already.
> | Key | Type | Description |
> | --- | --- | --- |
> | keyOrPath | Pathlike | Context key to see if it exists, either a row or nested property, and optionally insert the new value. |
> | input | Object, Array, Schema, Any | A value to input if the row or nested property wasn't found in the database. |
> | merge? | Boolean | Whether or not to merge `Input` with this Connection's Schema model as initial values. |
>
> Returns **{Boolean}** Whether or not the new value was inserted.

## [.modify(keyOrPath, method)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L652)
> Updates a value if the entry exists by fetching it and passing it onto the callback function.
> | Key | Type | Description |
> | --- | --- | --- |
> | keyOrPath | Pathlike | Specifies which row or nested property to fetch. |
> | method | Function | Callback which includes the original value of the fetched row or property. |
>
> Returns **{Object|Array|DataModel}** Returns the new row of the updated property.

## [.invert(keyOrPath)](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L676)
> Inverts a boolean, from true to false and vice-versa, at the endpoint of the path.
> | Key | Type | Description |
> | --- | --- | --- |
> | keyOrPath | Pathlike | Specifies which row or nested property to boolean-invert. |
>
> Returns **{Boolean}** Returns the updated boolean value of the property.

# Typedefs
## [RawOptions](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L694)
> Options for a database Connection. All integer related options are in milliseconds. 
> | Key | Type | Description |
> | --- | --- | --- |
> | table | String | A name for the table to use at this path for this Connection. |
> | schema | Schema | Link to a database Schema class for automatic data migration. |
> | WAL | Boolean | Whether or not to enable Write Ahead Logging mode. |
> | queries | Function | A function that gets ran for each executed SQL query in QDB. |
> | cache | Boolean | Whether to enable in-memory caching of entries in results that the next retrieval would be much faster. |
> | fetchAll | Boolean | Whether or not to fetch all the database entries on start-up of this database Connection. |
> | utilCache | Boolean | Whether or not to cache entries while performing utility tasks, such as the Exists method. |
> | cacheMaxSize | Number | Amount to be considered the maximum size. If this threshold is hit, the cache will temporarily stop adding new entries. |
> | sweepInterval | Number | Integer to indicate at what interval to sweep the entries of this Connection's internal cache. |
> | sweepLifetime | Number | The minimum age of an entry in the cache to consider being sweepable after an interval. |
>
> Type **{Object}**

## [DataModel](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L714)
> An entry which has been resolved from the Connection's internal cache.
> | Key | Type | Description |
> | --- | --- | --- |
> | _timestamp | Number | Timestamp when this entry was last patched. |
>
> Type **{Object|Array}**

## [Pathlike](https://github.com/QSmally/QDB/blob/v4/lib/Connections/Connection.js#L720)
> Path string to navigate files.
>
> Type **{String}**
