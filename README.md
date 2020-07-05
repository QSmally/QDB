
# QDB4
## An anti-corruption JSON database made with the Node runtime

**QDB4 is still heavily under development.**
**If you'd like to clone/contribute the stable project, head over to the master branch.**

> QDB is a high level JSON database, which you can import for storing local JavaScript Objects without corruptions.
> Connect to multiple local JSON files, apart or in a pool. Edit data directly or use built-in utility functions. Use polling for multi-process access and create backups of your databases if something were to go wrong.
> The library can withdraw corruptions and allows for a wide diversity of data transfer.


# Main Features
* Store in local JSON. Easily managable, or use [QDB's utility functions](https://qdb.qbot.eu/documentations/connections/connection).
* Create [pools](https://qdb.qbot.eu/documentations/connections/pool) and manage multiple databases.
* Allows access to [Qulity](https://qdb.qbot.eu/documentations/qulity) for [data utilities](https://github.com/QSmally/Qulity).
* * Like [DataStore](https://qdb.qbot.eu/qulity/datastore)s, [DataManager](https://qdb.qbot.eu/documentations/qulity/datamanager)s & [Queue](https://qdb.qbot.eu/documentations/qulity/queue)s.

## Links
* [Website](https://qdb.qbot.eu/)
* [Documentations](https://qdb.qbot.eu/docs)
* [Github](https://github.com/QSmally/QDB) ([Qulity](https://github.com/QSmally/Qulity))
* [Discord Server](https://qdb.qbot.eu/discord)

## Install/Import
`npm install qdatabase`
```js
const QDB  = require("qdatabase");
const MyDB = new QDB.Connection("./Databases/Users.json");
// ...
```


# Usage
For Qulity usage, check out [the Github](https://github.com/QSmally/Qulity#README).

# Issues, Contributing & License
If you've found a bug or want to suggest a feature, please ensure that it hasn't already been reported/suggested - Then, feel free to create an issue! If you'd like to contribute to the project, feel free to fork [the repository](https://github.com/QSmally/QDB) and create a pull request.

This module is licensed under [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0).
