
# Gateway

* [Start](https://github.com/QSmally/QDB/blob/v4/Documentation/Index.md)
* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Schema](https://github.com/QSmally/QDB/blob/v4/Documentation/Schema.md)
* [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
* [Selection](https://github.com/QSmally/QDB/blob/v4/Documentation/Selection.md)
* [Pool](https://github.com/QSmally/QDB/blob/v4/Documentation/Pool.md)
* [Gateway](https://github.com/QSmally/QDB/blob/v4/Documentation/Gateway.md)
* [PartialConnection](https://github.com/QSmally/QDB/blob/v4/Documentation/PartialConnection.md)

Identical to a Connection, but communicates with a thread instead.

| Key | Type | Description |
| --- | --- | --- |
| PathURL | Pathlike | Path to the database file of this Gateway. |
| Pool | Pool | Reference to this Gateway's instance Pool. |

This class is rather used than a Connection when initialised in a multithreaded Pool. Gateways will connect with the database thread, and asynchronously exchange data.



# Values
## [.Identifiers](https://github.com/QSmally/QDB/blob/v4/lib/Executors/Pool/ThreadProvider/Gateway.js#L14)
> Path string and database identifier. [**Read Only**]
>
> Type **{Array<Pathlike, String>}**

## [.Pool](https://github.com/QSmally/QDB/blob/v4/lib/Executors/Pool/ThreadProvider/Gateway.js#L25)
> The Pool reference of this Gateway. [**Read Only**]
>
> Type **{Pool}**

# Methods
## [.Query(Method, Parameters)](https://github.com/QSmally/QDB/blob/v4/lib/Executors/Pool/ThreadProvider/Gateway.js#L49) [**Async**]
> Asynchronously creates a query for this database.
> | Key | Type | Description |
> | --- | --- | --- |
> | Method | String | Method or property of the Connection to select. |
> | Parameters | ...Any | Additional parameters to give to the function. |
>
> Returns **{Promise<Any>}** Result from the thread.
