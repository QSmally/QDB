
# QDB4

> QDB is a synchronous database module reliant on JavaScript object-documents with multiple levels of optimisation built into it.


# Features
* Optimised entry caches;
* Database schema and automatic migration;
* Selection and transaction wrappers;
* Pools with external thread support.

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
const MyDB = new QDB.Connection(Path, Options?);
```

## [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
A SQL transaction manager.
```js
const Transaction = MyDB.Transaction();
// Perform changes in the database...
Transaction.Commit(); // or
Transaction.Rollback();
```

## [Selection](https://github.com/QSmally/QDB/blob/v4/Documentation/Selection.md)
An unchanged piece of the database in memory.
```js
const Users = Programmers.Select()
.Join(Projects, "UserId", "Projects")
.Order(User => Object.keys(User.Projects).length)
.Group("Rank");
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
