
# QDB4 Documentations

### Install/Import
`npm install qdatabase`
```js
const QDB = require("qdatabase");
```

### Current implemented classes
* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
* [PartialConnection](https://github.com/QSmally/QDB/blob/v4/Documentation/PartialConnection.md)
* [Schema](https://github.com/QSmally/QDB/blob/v4/Documentation/Schema.md)

### Methods
Access created Schemas using the `Model(Id)` method.
```js
const UserModel = QDB.Model("Users");
```
