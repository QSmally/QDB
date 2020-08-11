
/**
 * Fetches everything in this Connection and caches it internally.
 * @param {Connection} Connection 
 * @returns {undefined}
 */
module.exports = Connection => {
    Connection.API.prepare(`SELECT * FROM '${Connection.Table}';`)
    .forEach((Val, Key) => Connection.Cache.set(Key, Val));
}
