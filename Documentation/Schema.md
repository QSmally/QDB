
# Schema

* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Pool](https://github.com/QSmally/QDB/blob/v4/Documentation/Pool.md)

**Managers**
* [Backup Manager](https://github.com/QSmally/QDB/blob/v4/Documentation/Manager.md)

**Utilities**
* [Transaction](https://github.com/QSmally/QDB/blob/v4/Documentation/Transaction.md)
* [Selection](https://github.com/QSmally/QDB/blob/v4/Documentation/Selection.md)
* [Schema](https://github.com/QSmally/QDB/blob/v4/Documentation/Schema.md)

A generic model that entries of a database automatically follows.

| Key | Type | Description |
| --- | --- | --- |
| Id | String | An identifier for this Schema Model. |
| Model | Object, Array | An object or array, giving the layout and default values of entries. |
| Serialiser? | Function | A transformer object to implement, as a utility to fetch from some type of API or DataModel. |

Schema Models are mainly used for automatic data migrations - For instance, adding or removing default data parts of each entry in the database. Include the `-m` command line option when starting the program to instantiate a migration.



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
## [.Instance(Target)](https://github.com/QSmally/QDB/blob/v4/lib/Utility/Schema.js#L61)
> Public method. Integrates an entry object and integrates them with this Schema's Model.
> | Key | Type | Description |
> | --- | --- | --- |
> | Target | Object | The main entry to compare against and to merge changes into. |
>
> Returns **{Object}** A merged data object based on this Schema's Model.
