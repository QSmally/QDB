
# Types

* [Start](https://github.com/QSmally/QDB/blob/v4/Documentation/Index.md)
* [BaseConnection](https://github.com/QSmally/QDB/blob/v4/Documentation/BaseConnection.md)
* [PartialConnection](https://github.com/QSmally/QDB/blob/v4/Documentation/PartialConnection.md)
* [Connection](https://github.com/QSmally/QDB/blob/v4/Documentation/Connection.md)
* [Types](https://github.com/QSmally/QDB/blob/v4/Documentation/Types.md)



## [.RawOptions](https://github.com/QSmally/QDB/blob/v4/lib/Types.js#L2)
> Raw options for setting up a Connection.
> | Key | Type | Description |
> | --- | --- | --- |
> | FetchAll? | Boolean | Whether to fetch all entries on startup. |
> | SweepInterval? | Number | Integer to indicate the interval of cache sweeping. |
> | Backups? | String, Boolean | String for the path of the backup directory, otherwise 'false'. |
> | Cache? | Boolean | Boolean to indicate whether to cache newly fetched entries. (This WILL increase memory usage.) |
> | WAL? | Boolean | Boolean to indicate whether to use Write Ahead Logging as journal mode. |
>
> Type **{Object}**

## [.Pathlike](https://github.com/QSmally/QDB/blob/v4/lib/Types.js#L12)
> A path to some sort of file or directory.
>
> Type **{String}**
