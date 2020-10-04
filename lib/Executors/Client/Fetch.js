
/**
 * Fetches everything in this Connection and caches it internally.
 * @param {Connection} Connection Reference to this Executor's Connection.
 * @returns {Number} Size of the cache.
 */
module.exports = Connection => {
    Connection.API.prepare(`SELECT * FROM '${Connection.Table}';`)
    .all().forEach(Entry => Connection._Patch(Entry.Key, Entry.Val));
    return Connection.CacheSize;
}
