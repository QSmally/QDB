
/**
 * Raw options for setting up a Connection.
 * @typedef {Object} RawOptions
 * @param {String} [Table] The name of the table to use for this Connection's database.
 * @param {Boolean} [Cache] Boolean to indicate whether to cache newly fetched entries.
 * @param {Number} [SweepTime] Integer to indicate the interval of cache sweeping.
 * @param {Number} [SweepLife] Integer to determine how old a cache entry has to be for it to be swept.
 * @param {Boolean} [FetchAll] Whether to fetch all entries on startup of this Connection.
 * @param {String|Boolean} [Backups] String for the path of the backup directory, otherwise 'false'.
 * @param {Boolean} [WAL] Boolean to indicate whether to use Write Ahead Logging as journal mode.
 */

/**
 * A path to some sort of file or directory.
 * @typedef {String} Pathlike
 */
