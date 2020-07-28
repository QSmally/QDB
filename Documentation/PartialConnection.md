
# PartialConnection
### Extends **{BaseConnection}**

* [Start](https:/github.com/QSmally/Docgen/blob/master/Documentation/Index.md)
* [BaseConnection](https:/github.com/QSmally/Docgen/blob/master/Documentation/BaseConnection.md)
* [PartialConnection](https:/github.com/QSmally/Docgen/blob/master/Documentation/PartialConnection.md)
* [Connection](https:/github.com/QSmally/Docgen/blob/master/Documentation/Connection.md)

Instantiates an idle connection.
```js
this.Database = new QDB.PartialConnection();
```





# Methods
## [.Resume(PathURL, Options?)](https:/github.com/QSmally/Docgen/blob/master/Documentation/PartialConnection.js#L22)
> Reconnects to a database path.
> | Key | Type | Description |
> | --- | --- | --- |
> | PathURL | Pathlike | Path to the database file. |
> | Options? | Object | Options to pass onto the database. |
>
> Returns **{Connection|PartialConnection}** 