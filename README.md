
# QDB 4.1

> QDB is a SQLite framework reliant on JavaScript documents with various optimisations included.

# Features
* Synchronous, non-blocking API (built on [`better-sqlite3`](https://github.com/JoshuaWise/better-sqlite3));
* Configurable cache with eviction strategies;
* Schema objects and automatic migration;
* Selection and transaction support.

## Performance
The QDB 4.1 build reaches similar insert rates and faster retrieval speeds as opposed to QDB 4.0, while implementing additional security features such as cloning entries from the cache before returning them. Methods such as `.find()` have drastically improved in performance.

## Links
<!-- * [Documentations](https://github.com/QSmally/QDB) -->
* [Github](https://github.com/QSmally/QDB)

## Installation
`npm install QSmally/QDB#staging`
```js
const { Connection, ... } = require("qdatabase");
// ...
```

# Usage

## [Connection](https://github.com/QSmally/QDB/blob/staging/Sources/Connection.js)
The main interface for interacting with QDB.
```js
const persistentStorage = new Connection("/opt/company/Cellar/Users.qdb", {
    cache: CacheStrategy.managed({ maxSize: 1e4 })
});
```

## [Transaction](https://github.com/QSmally/QDB/blob/staging/Sources/Structures/Transaction.js)
A SQL transaction manager.
```js
// Instantiates a transaction within the database. It is required to
// call 'commit' or 'rollback' on the returned Transaction struct.
const transaction = persistentStorage.transaction();

// Perform changes in the connection...
transaction.commit(); // or
transaction.rollback();
```

## [Selection](https://github.com/QSmally/QDB/blob/staging/Sources/Structures/Selection.js)
An unchanged piece of the database in memory.
```js
// Aggregate with certain instructions, like joining tables,
// ordering them and regrouping them by a property.
const users = persistentStorage.select()
    .join(projectsStorage, JoinStrategy.property("projects"), "userId")
    .order(SortingPredicate.descending(user => Object.keys(user.projects).length))
    .group("rank");
```

# QDB Shell
The library integrates a CLI for interacting with QDB deployments.

`npm install -g QSmally/QDB#staging`

```s
$ qdb make Instances.qdb
$ qdb Development.qdb create Users
$ qdb Production.qdb vacuum
```

This module is licensed under [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0).
