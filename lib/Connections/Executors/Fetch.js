
/**
 * Fetches everything in this Connection and caches it internally.
 * @param {Connection} connection Reference to this Executor's Connection.
 * @returns {Number} Size of the cache.
 */
module.exports = connection => {
    const maxSize = connection.valOptions.cacheMaxSize;
    if (maxSize !== false && maxSize <= 0) return null;
    if (maxSize && typeof maxSize !== "number") return null;

    connection.API.prepare(`SELECT Key, Val FROM '${connection.table}'${maxSize ? ` LIMIT 0,${maxSize}` : ""};`)
        .all()
        .forEach(entry => connection._patch(entry.Key, JSON.parse(entry.Val)));
    return connection.cacheSize;
}
