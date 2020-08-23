
# Transaction

* [Start](https://github.com/QSmally/QDB/blob/v4/Documentation/Index.md)
* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
* [PartialConnection](https://github.com/QSmally/QDB/blob/v4/Documentation/PartialConnection.md)

A SQL transaction manager.



# Values
## [.Active](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Transaction.js#L31)
> Whether this Transaction is active. [**Read Only**]
>
> Type **{Boolean}**

# Methods
## [.Commit()](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Transaction.js#L47)
> Commits the changes made during this transaction.
>
> Returns **{Boolean}** Whether the changed were committed.

## [.Rollback()](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Transaction.js#L58)
> Rolls back the changes made before the start of this Transaction. This also changed the contents of the Connection's internal cache.
>
> Returns **{Boolean}** Whether the changed were reset.
