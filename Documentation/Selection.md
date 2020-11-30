
# Selection

* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Pool](https://github.com/QSmally/QDB/blob/v4/Documentation/Pool.md)

**Utilities**
* [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
* [Selection](https://github.com/QSmally/QDB/blob/v4/Documentation/Selection.md)
* [Schema](https://github.com/QSmally/QDB/blob/v4/Documentation/Schema.md)

An unchanged piece of the database in memory, to use as baseline of various endpoints to execute functions with.
```js
const Selection = MyDB.Select(User => User.Age > 20);
```

A Selection allows you to filter something from the database, and perform methods such as sorting, limiting and iterating to grab results and leave the database unchanged.



# Values
## [.Cache](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L17)
> Cached dataset instances of this Selection. [**Read Only**]
>
> Type **[{Collection}](https://github.com/QSmally/Qulity/blob/master/Documentation/Collection.md)**

## [.Holds](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L32)
> Reference to the table this Selection holds. [**Read Only**]
>
> Type **{String}**

## [.Keys](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L46)
> Serialises this Selection's keys into an array.
>
> Type **{Array}**

## [.Values](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L55)
> Serialises this Selection's values into an array.
>
> Type **{Array}**

## [.AsObject](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L64)
> Serialises this Selection into an object.
>
> Type **{Object}**

# Methods
## [.Retrieve(Key)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L74)
> Returns the given document by its key from this Selection.
> | Key | Type | Description |
> | --- | --- | --- |
> | Key | Pathlike | Indicates which element to fetch. |
>
> Returns **{Object|Array|DataModel}** 

## [.Sort(Fn)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L87)
> Sorts this Selection's values. Identical to the `SORT BY` SQL statement.
> | Key | Type | Description |
> | --- | --- | --- |
> | Fn | Function | Function that determines the sort order. |
>
> Returns **{Selection}** 

## [.Filter(Fn)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L99)
> Filters values that satisfy the provided function. Identical to the `FILTER BY` SQL statement.
> | Key | Type | Description |
> | --- | --- | --- |
> | Fn | Function | Function that determines which entries to keep. |
>
> Returns **{Selection}** 

## [.Limit(Begin, End?)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L115)
> Slices off values from this Selection. Identical to the `LIMIT` SQL statement.
> | Key | Type | Description |
> | --- | --- | --- |
> | Begin | Number | Integer to indicate the beginning to slice. |
> | End? | Number | Integer to indicate the end of the slice. |
>
> Returns **{Selection}** 

## [.Group(Key)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L138)
> Groups this Selection based on an identifier. Identical to the `GROUP BY` SQL statement.
> | Key | Type | Description |
> | --- | --- | --- |
> | Key | Pathlike | Indicates by which element to group this Selection. |
>
> Returns **{Selection}** 

## [.Join(Secondary, Field, Property?)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L164)
> Joins another Selection into this instance based on a referrer field. Identical to the `FULL JOIN` SQL statement.
> | Key | Type | Description |
> | --- | --- | --- |
> | Secondary | Selection | Another Selection instance to join into this one. |
> | Field | String | Which field to check for a reference to this Selection's rows. |
> | Property? | Boolean, String | Boolean false to flatten the entries into this Selection's rows, a string value that implicitly indicates the property to add the merging entries, or a boolean true to use the Selection's table name as property. |
>
> Returns **{Selection}** 

## [.Map(Fn)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L197)
> Iterates over this Selection's values and keys, and implements the new values returned from the callback.
> | Key | Type | Description |
> | --- | --- | --- |
> | Fn | Function | Callback function which determines the new values of the Selection. |
>
> Returns **{Selection}** 

## [.Merge(Selections)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L212)
> Automatically clones the merging Selections and adds them into this instance.
> | Key | Type | Description |
> | --- | --- | --- |
> | Selections | ...Selection | Instances to clone and merge into this one. |
>
> Returns **{Selection}** 

## [.Clone(Holds?)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L227)
> Creates a new memory allocation for the copy of this Selection.
> | Key | Type | Description |
> | --- | --- | --- |
> | Holds? | String | Optional new identifier value for the cloned Selection. |
>
> Returns **{Selection}** 
