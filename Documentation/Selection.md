
# Selection

* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Pool](https://github.com/QSmally/QDB/blob/v4/Documentation/Pool.md)
* [Gateway](https://github.com/QSmally/QDB/blob/v4/Documentation/Gateway.md)
* [PartialConnection](https://github.com/QSmally/QDB/blob/v4/Documentation/PartialConnection.md)

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
## [.Cache](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L14)
> Cached dataset instances of this Selection. [**Read Only**]
>
> Type **{Map}**

## [.Keys](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L31)
> Serialises this Selection's keys into an array.
>
> Type **{Array}**

## [.Values](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L40)
> Serialises this Selection's values into an array.
>
> Type **{Array}**

## [.AsObject](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L49)
> Serialises this Selection into an object.
>
> Type **{Object}**

# Methods
## [.Sort(Fn)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L61)
> Sorts this Selection's values. Identical to the `SORT BY` SQL statement.
> | Key | Type | Description |
> | --- | --- | --- |
> | Fn | Function | Function that determines the sort order. |
>
> Returns **{Selection}** 

## [.Filter(Fn)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L73)
> Filters values that satisfy the provided function. Identical to the `FILTER BY` SQL statement.
> | Key | Type | Description |
> | --- | --- | --- |
> | Fn | Function | Function that determines which entries to keep. |
>
> Returns **{Selection}** 

## [.Limit(Begin, End?)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L89)
> Slices off values from this Selection. Identical to the `LIMIT` SQL statement.
> | Key | Type | Description |
> | --- | --- | --- |
> | Begin | Number | Integer to indicate the beginning to slice. |
> | End? | Number | Integer to indicate the end of the slice. |
>
> Returns **{Selection}** 

## [.Group(Key)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L112)
> Groups this Selection based on an identifier. Identical to the `GROUP BY` SQL statement.
> | Key | Type | Description |
> | --- | --- | --- |
> | Key | Pathlike | Indicates by which element to group this Selection. |
>
> Returns **{Selection}** 

## [.Map(Fn)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L141)
> Iterates over this Selection's values and keys, and implements the new values returned from the callback.
> | Key | Type | Description |
> | --- | --- | --- |
> | Fn | Function | Callback function which determines the new values of the Selection. |
>
> Returns **{Selection}** 

## [.Clone()](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Selection.js#L156)
> Creates a new memory allocation for the copy of this Selection.
>
> Returns **{Selection}** 
