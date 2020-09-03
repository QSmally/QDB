
# Schema

* [Start](https://github.com/QSmally/QDB/blob/v4/Documentation/Index.md)
* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Schema](https://github.com/QSmally/QDB/blob/v4/Documentation/Schema.md)
* [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
* [Selection](https://github.com/QSmally/QDB/blob/v4/Documentation/Selection.md)
* [PartialConnection](https://github.com/QSmally/QDB/blob/v4/Documentation/PartialConnection.md)

A general model that entries of a database should follow.

| Key | Type | Description |
| --- | --- | --- |
| Id | String | An identifier for this Schema Model. |
| Model | Object, Array | An object or array, giving the layout and default values of entries. |
| Serialiser? | Function | A transformer object to implement, as a utility to fetch from some type of API or DataModel. |

Schema Models are mainly used for automatic data migration - For instance, adding or removing data parts of each entry in the database.



# Values
## [.Model](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Schema.js#L21)
> The default model of this Schema. [**Read Only**]
>
> Type **{Object|Array}**

## [.Serialiser](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Schema.js#L32)
> A Serialiser function that converts an entry to a rich DataModel on request. [**Read Only**]
>
> Type **{Function|undefined}**

# Methods
## [.Migrate(Target)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Schema.js#L49)
> Public method. Integrates an entry object and merges them with this Schema's Model.
> | Key | Type | Description |
> | --- | --- | --- |
> | Target | Object | A main entry object to compare against, and to integrate changes to. |
>
> Returns **{Object}** A merged object, based on this Schema's Model.
