
# QDB4

> QDB is a synchronous database module reliant on JavaScript object-documents with multiple levels of optimisation built into it.


# Features
* Non-blocking;
* Optimised memory cache;
* Schema objects and automatic migration;
* Selection and transaction wrappers;
* Connection pools with external thread support.

## Links
* [Documentations](https://github.com/QSmally/QDB/blob/v4/Documentation/Index.md)
* [Github](https://github.com/QSmally/QDB)

## Installation
`npm install QSmally/QDB`
```js
const QDB = require("qdatabase");
// ...
```


# Usage

## [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
The main interface for interacting with QDB.
```js
const service = new QDB.Connection(path, options?);
```

## [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
A SQL transaction manager.
```js
// Instantiates a transaction within the database. It is required
// to call 'commit' or 'rollback' on the returned Transaction.
const transaction = service.transaction();

// Perform changes in the connection...
transaction.commit(); // or
transaction.rollback();
```

## [Selection](https://github.com/QSmally/QDB/blob/v4/Documentation/Selection.md)
An unchanged piece of the database in memory.
```js
// Aggregate with certain instructions, like joining tables,
// ordering them and regrouping them by a property.
const users = service.select()
    .join(projects, "UserId", "Projects")
    .order(user => Object.keys(user.Projects).length, QDB.descending)
    .group("Rank");
```


# QDB Shell
The library integrates a CLI for interacting with QDB deployments.

`npm install -g QSmally/QDB`

```s
$ qdb make Instances.qdb
$ qdb Development.qdb create Users
$ qdb Production.qdb vacuum
```


This module is licensed under [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0).
