
# PartialConnection
### Extends **{BaseConnection}**

* [Start](https://github.com/QSmally/QDB/blob/v4/Documentation/Index.md)
* [BaseConnection](https://github.com/QSmally/QDB/blob/v4/Documentation/BaseConnection.md)
* [PartialConnection](https://github.com/QSmally/QDB/blob/v4/Documentation/PartialConnection.md)
* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Types](https://github.com/QSmally/QDB/blob/v4/Documentation/Types.md)

Instantiates an idle connection.
```js
this.Database = new QDB.PartialConnection();
```



# Methods
## [.Resume(PathURL, Options?)](https://github.com/QSmally/QDB/blob/v4/lib/PartialConnection.js#L22)
> Reconnects to a database path.
> | Key | Type | Description |
> | --- | --- | --- |
> | PathURL | Pathlike | Path to the database file. |
> | Options? | Object | Options to pass onto the database. |
>
> Returns **{Connection|PartialConnection}** 
