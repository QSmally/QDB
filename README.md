
# QDB4
## An optimised SQL database

**QDB4 is not in a usable state, only a few methods and very few features are implemented. Please use the [legacy repository](https://github.com/QSmally/QDB-Legacy)!** [[Contribute](#issues-contributing--license)] [[Documentation](https://github.com/QSmally/QDB/blob/v4/Documentation/Index.md)]

> QDB is a high level database module which is based around JavaScript Objects. Connect to multiple files, apart or in an optimised pool.


# Main Features
* Connection states
* Optimised caches
* Simple class interface
<!-- * Database Pool -->
<!-- * JSONConnection -->

## Links
* [Documentations](https://github.com/QSmally/QDB/blob/v4/Documentation/Index.mc)
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

## [Connection](https://github.com/QSmally/QDB/blob/b4/Documentation/Connection.md)
The main interface for interacting with QDB.
```js
const MyDB = new QDB.Connection(Path, Options?);
```

# Issues, Contributing & License
If you've found a bug or want to suggest a feature, please ensure that it hasn't already been reported/suggested - Then, feel free to create an [issue](https://github.com/QSmally/QDB/issues)! If you'd like to contribute to the project, feel free to fork [the repository](https://github.com/QSmally/QDB) and create a pull request.

This module is licensed under [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0).
