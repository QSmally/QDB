
# Schema

* [Start](https://github.com/QSmally/QDB/blob/v4/Documentation/Index.md)
* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
* [PartialConnection](https://github.com/QSmally/QDB/blob/v4/Documentation/PartialConnection.md)
* [Schema](https://github.com/QSmally/QDB/blob/v4/Documentation/Schema.md)

A general scheme model that entries of a database should follow.

| Key | Type | Description |
| --- | --- | --- |
| Id | String | An identifier for this scheme model. |
| Model | Object, Array | An object or array, giving the layout and default values of entries. |
| Serialiser | Function | A transformer object to implement, as a utility to fetch from some type of API or DataModel. |

Schema Models are mainly used for automatic data migrated - For instance, adding or removing data parts of each entry in the database.



# Values
## [.Model](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Schema.js#L21)
> The default Model of this Schema. [**Read Only**]
>
> Type **{Object|Array}**

## [.Serialiser](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Schema.js#L32)
> A Serialiser function that converts an entry to a rich DataModel scheme on request. [**Read Only**]
>
> Type **{Function|undefined}**
