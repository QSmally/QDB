
# Transaction

* [Start](https://github.com/QSmally/QDB/blob/v4/Documentation/Index.md)
* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
* [PartialConnection](https://github.com/QSmally/QDB/blob/v4/Documentation/PartialConnection.md)
* [Schema](https://github.com/QSmally/QDB/blob/v4/Documentation/Schema.md)

A SQL transaction manager.

| Key | Type | Description |
| --- | --- | --- |
| _Connection | Connection | A Connection this Transaction is referring to. |

Transactions should only be created in synchronous environments, as other data changed will also be included in the transaction - which can be rolled back, leading to unexpected results.



# Values
## [.Active](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Transaction.js#L32)
> Whether this Transaction is active. [**Read Only**]
>
> Type **{Boolean}**

# Methods
## [.Commit()](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Transaction.js#L48)
> Commits the changes made during this transaction.
>
> Returns **{Boolean}** Whether the changed were committed.

## [.Rollback()](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Transaction.js#L59)
> Rolls back the changes made before the start of this Transaction. This also changed the contents of the Connection's internal cache.
>
> Returns **{Boolean}** Whether the changed were reset.
