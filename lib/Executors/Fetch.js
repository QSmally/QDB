
/**
 * Fetches everything in this Connection and caches it internally.
 * @param {Connection} Connection Reference to this Executor's Connection.
 * @returns {Number} Size of the cache.
 */
module.exports = Connection => {
    Connection.API.prepare(`SELECT * FROM '${Connection.Table}';`)
    .forEach((Val, Key) => Connection.Cache.set(Key, Val));
    return Connection.CacheSize;
}
