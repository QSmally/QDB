
# QDB4 Documentations

### Install/Import
`npm install qdatabase`
```js
const QDB = require("qdatabase");
```

### Current implemented classes
* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Pool](https://github.com/QSmally/QDB/blob/v4/Documentation/Pool.md)

**Managers**
* [Backup Manager](https://github.com/QSmally/QDB/blob/v4/Documentation/Manager.md)

**Utilities**
* [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
* [Selection](https://github.com/QSmally/QDB/blob/v4/Documentation/Selection.md)
* [Schema](https://github.com/QSmally/QDB/blob/v4/Documentation/Schema.md)

### Methods
Access created Schemas using the `model(id: String) -> Schema` method.
```js
const userSchemaModel = QDB.model("Users");
```
