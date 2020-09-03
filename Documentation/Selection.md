
# Selection
### Extends **[{Manager}](https://github.com/QSmally/Qulity/blob/master/Documentation/Manager.md)**

* [Start](https://github.com/QSmally/QDB/blob/v4/Documentation/Index.md)
* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Schema](https://github.com/QSmally/QDB/blob/v4/Documentation/Schema.md)
* [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
* [Selection](https://github.com/QSmally/QDB/blob/v4/Documentation/Selection.md)
* [PartialConnection](https://github.com/QSmally/QDB/blob/v4/Documentation/PartialConnection.md)

An unchanged piece of the database in memory, to use as baseline of various endpoints to execute functions with.
```js
const Selection = MyDB.Select(User => User.Age > 20);
```

A Selection allows you to filter something from the database, and perform methods such as sorting, limiting and iterating to grab results and leave the database unchanged.



# Values
## [.Keys](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L22)
> Serialises this Selection's keys into an array.
>
> Type **{Array}**

## [.Values](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L31)
> Serialises this Selection's values into an array.
>
> Type **{Array}**

## [.AsObject](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L40)
> Serialises this Selection into an object.
>
> Type **{Object}**

# Methods
## [.Sort(Fn)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L50)
> Sorts this Selection's values. Identical to the `SORT BY` SQL statement.
> | Key | Type | Description |
> | --- | --- | --- |
> | Fn | Function | Function that determines the sort order. |
>
> Returns **{Selection}** 

## [.Filter(Fn)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L62)
> Filters values that satisfy the provided function. Identical to the `FILTER BY` SQL statement.
> | Key | Type | Description |
> | --- | --- | --- |
> | Fn | Function | Function that determines which entries to keep. |
>
> Returns **{Selection}** 

## [.Limit(Begin, End?)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L78)
> Slices off values from this Selection. Identical to the `LIMIT begin, end` SQL statement.
> | Key | Type | Description |
> | --- | --- | --- |
> | Begin | Number | Integer to indicate the beginning to slice. |
> | End? | Number | Integer to indicate the end of the slice. |
>
> Returns **{Selection}** 
