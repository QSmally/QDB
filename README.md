
# QDB4
## An optimised SQL database

**QDB4 is stable and usable.** [[Contribute](#issues-contributing--license)] [[Documentation](https://github.com/QSmally/QDB/blob/v4/Documentation/Index.md)]

> QDB is a high level database module which is based around JavaScript Objects. Connect to multiple files, apart or in an optimised pool.


# Main Features
* Connection states
* A simple class interface
* Optimised entry caches
* Selection and transaction wrappers
* Database pools with threads

## Links
* [Documentations](https://github.com/QSmally/QDB/blob/v4/Documentation/Index.md)
* [Github](https://github.com/QSmally/QDB)
* [Discord Server](https://qdb.qbot.eu/discord)

## Install/Import
`npm install qdatabase`
```js
const QDB = require("qdatabase");
// ...
```

## Dependencies (Top Level)
* [Qulity](https://npmjs.org/package/qulity)
* [better-sqlite3](https://npmjs.org/package/better-sqlite3)
* [QSmally/Docgen](https://github.com/QSmally/Docgen) (Development)


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
// Changes in the database...
Transaction.Commit(); // or
Transaction.Rollback();
```

## [Selection](https://github.com/QSmally/QDB/blob/v4/Documentation/Selection.md)
An unchanged piece of the database in memory.
```js
const Leaderboard = MyDB.Select("1234567890")
.Sort((a, b) => b.Experience - a.Experience)
.Limit(0, 10);
```

# Issues, Contributing & License
If you've found a bug or want to suggest a feature, please ensure that it hasn't already been reported/suggested - Then, feel free to create an [issue](https://github.com/QSmally/QDB/issues)! If you'd like to contribute to the project, feel free to fork [the repository](https://github.com/QSmally/QDB) and create a pull request.

This module is licensed under [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0).
