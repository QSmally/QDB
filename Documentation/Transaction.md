
# Transaction

* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Pool](https://github.com/QSmally/QDB/blob/v4/Documentation/Pool.md)

**Managers**
* [Backup Manager](https://github.com/QSmally/QDB/blob/v4/Documentation/Manager.md)

**Utilities**
* [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
* [Selection](https://github.com/QSmally/QDB/blob/v4/Documentation/Selection.md)
* [Schema](https://github.com/QSmally/QDB/blob/v4/Documentation/Schema.md)

A SQL transaction manager.
```js
const Transaction = MyDB.Transaction();
```

Transactions should only be created in synchronous environments, as other data changed will also be included in the transaction - which can be rolled back, leading to unexpected results.



# Values
## [.Active](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Transaction.js#L23)
> Whether this Transaction is active. [**Read Only**]
>
> Type **{Boolean}**

# Methods
## [.Commit()](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Transaction.js#L40)
> Publishes the changes made during this Transaction.
>
> Returns **{Boolean}** Whether the changed were committed.

## [.Rollback()](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Transaction.js#L54)
> Rolls back the changes made before the start of this Transaction. This also clears the contents of the Connection's internal cache.
>
> Returns **{Boolean}** Whether the changed were reset.
