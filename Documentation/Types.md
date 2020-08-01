
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
> | Table? | String | The name of the table to use for this Connection's database. |
> | Cache? | Boolean | Boolean to indicate whether to cache newly fetched entries. |
> | SweepTime? | Number | Integer to indicate the interval of cache sweeping. |
> | SweepLife? | Number | Integer to determine how old a cache entry has to be for it to be swept. |
> | FetchAll? | Boolean | Whether to fetch all entries on startup of this Connection. |
> | Backups? | String, Boolean | String for the path of the backup directory, otherwise 'false'. |
> | WAL? | Boolean | Boolean to indicate whether to use Write Ahead Logging as journal mode. |
>
> Type **{Object}**

## [.Pathlike](https://github.com/QSmally/QDB/blob/v4/lib/Types.js#L14)
> A path to some sort of file or directory.
>
> Type **{String}**
