
# QDB4 Documentations

### Install/Import
`npm install qdatabase`
```js
const QDB = require("qdatabase");
```

### Current implemented classes
* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Schema](https://github.com/QSmally/QDB/blob/v4/Documentation/Schema.md)
* [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
* [Selection](https://github.com/QSmally/QDB/blob/v4/Documentation/Selection.md)
* [PartialConnection](https://github.com/QSmally/QDB/blob/v4/Documentation/PartialConnection.md)

### Methods
Access created Schemas using the `Model(Id: String) -> Schema` method.
```js
const UserModel = QDB.Model("Users");
```
