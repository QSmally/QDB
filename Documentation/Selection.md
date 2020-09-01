
# Selection
### Extends **{Manager}**

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

| Key | Type | Description |
| --- | --- | --- |
| _Entries | Object | Initial selection of entries for this Selection instance. |

A Selection allows you to filter something from the database, and perform methods such as sorting, limiting and iterating to grab results and leave the database unchanged.


