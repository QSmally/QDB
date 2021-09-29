
# Selection

* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Pool](https://github.com/QSmally/QDB/blob/v4/Documentation/Pool.md)

**Managers**
* [Backup Manager](https://github.com/QSmally/QDB/blob/v4/Documentation/Manager.md)

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
## [.cache](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L18)
> Cached dataset of this Selection. [**Read Only**]
>
> Type **[{Collection}](https://github.com/QSmally/Qulity/blob/master/Documentation/Collection.md)**

## [.holds](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L33)
> Reference to the table this Selection holds. [**Read Only**]
>
> Type **{String}**

## [.keys](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L46)
> Serialises this Selection's keys into an array.
>
> Type **{Array}**

## [.values](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L55)
> Serialises this Selection's values into an array.
>
> Type **{Array}**

## [.asObject](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L64)
> Serialises this Selection into an object.
>
> Type **{Object}**

# Methods
## [.retrieve(keyOrPath)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L74)
> Returns the given document by its key from this Selection.
> | Key | Type | Description |
> | --- | --- | --- |
> | keyOrPath | Pathlike | Indicates which (nested) element to receieve. |
>
> Returns **{Object|Array|DataModel}** 

## [.order(predicate, preset?)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L116)
> Sorts this Selection's values. Identical to the `ORDER BY` SQL statement.
> | Key | Type | Description |
> | --- | --- | --- |
> | predicate | Function | Function which either determines the sort order with given arguments `a` and `b` when the preset is arbitrary, or a function to the target property to automatically sort with. |
> | preset? | Order | A sort order, an enum from QDB being `ascending`, `descending` or `arbitrary` (default). |
>
> Returns **{Selection}** 

## [.filter(predicate)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L135)
> Filters values that satisfy the provided function. Identical to the `FILTER BY` SQL statement.
> | Key | Type | Description |
> | --- | --- | --- |
> | predicate | Function | Function that determines which entries to keep. |
>
> Returns **{Selection}** 

## [.limit(begin, end?)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L153)
> Slices off values from this Selection. Identical to the `LIMIT` SQL statement.
> | Key | Type | Description |
> | --- | --- | --- |
> | begin | Number | Index that indicates the beginning to slice. |
> | end? | Number | An index for the end of the slice. |
>
> Returns **{Selection}** 

## [.group(keyOrPath)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L176)
> Groups this Selection based on an identifier. Identical to the `GROUP BY` SQL statement.
> | Key | Type | Description |
> | --- | --- | --- |
> | keyOrPath | Pathlike | Determines by which property to group this Selection. |
>
> Returns **{Selection}** 

## [.join(secondary, field, property?)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L203)
> Joins another Selection into this instance based on a referrer field. Identical to the `FULL JOIN` SQL statement.
> | Key | Type | Description |
> | --- | --- | --- |
> | secondary | Selection | Another Selection instance to join into this one. |
> | field | String | Which field to check for a reference to this Selection's rows, or `null` to join with keys. |
> | property? | Boolean, String | Boolean false to flatten the entries into this Selection's rows, a string value that implicitly indicates the property to add the merging entries, or a boolean true to use the Selection's table name as property. |
>
> Returns **{Selection}** 

## [.map(fn)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L237)
> Iterates over this Selection's values and keys, and implements the new values returned from the callback.
> | Key | Type | Description |
> | --- | --- | --- |
> | fn | Function | Callback function which determines the new values of the Selection. |
>
> Returns **{Selection}** 

## [.merge(selections)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L252)
> Automatically clones the merging Selections and adds them into this instance.
> | Key | Type | Description |
> | --- | --- | --- |
> | selections | ...Selection | Instances to clone and merge into this one. |
>
> Returns **{Selection}** 

## [.clone(holds?)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L267)
> Creates a new memory allocation for the copy of this Selection.
> | Key | Type | Description |
> | --- | --- | --- |
> | holds? | String | Optional new identifier value for the cloned Selection. |
>
> Returns **{Selection}** 
