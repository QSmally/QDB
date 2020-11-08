
# Schema

* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Pool](https://github.com/QSmally/QDB/blob/v4/Documentation/Pool.md)

**Utilities**
* [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
* [Selection](https://github.com/QSmally/QDB/blob/v4/Documentation/Selection.md)
* [Schema](https://github.com/QSmally/QDB/blob/v4/Documentation/Schema.md)

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

## [.Serialise](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Schema.js#L49)
> Serialises a supposed database entry to this Schema's rich DataModel, if this Schema was instantiated with a Serialiser method.
>
> Type **{Function}**

# Methods
## [.Instance(Target)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Schema.js#L60)
> Public method. Integrates an entry object and integrates them with this Schema's Model.
> | Key | Type | Description |
> | --- | --- | --- |
> | Target | Object | The main entry to compare against and to merge changes into. |
>
> Returns **{Object}** A merged data object based on this Schema's Model.
