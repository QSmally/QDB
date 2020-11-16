
/**
 * Fetches everything in this Connection and caches it internally.
 * @param {Connection} Connection Reference to this Executor's Connection.
 * @returns {Number} Size of the cache.
 */
module.exports = Connection => {

    const MaxSize = Connection.ValOptions.CacheMaxSize;
    if (MaxSize !== false && MaxSize <= 0)      return null;
    if (MaxSize && typeof MaxSize !== "number") return null;

    Connection.API.prepare(`SELECT * FROM '${Connection.Table}'${MaxSize ? ` LIMIT 0,${MaxSize}` : ""};`)
    .all().forEach(Entry => Connection._Patch(Entry.Key, JSON.parse(Entry.Val)));
    return Connection.CacheSize;
}
