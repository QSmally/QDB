
/**
 * Sweep manager of the Connection, according to given options.
 * @param {Connection} Connection 
 * @returns {Function}
 */
module.exports = Connection => {
    const Lifetime = Connection.ValOptions.SweepLifetime;
    return setInterval(() => {
        const Time = Date.now();
        Connection.Cache.each((e, Key) => {
            if (Time - e._Timestamp >= Lifetime)
            Connection.Cache.delete(Key);
        });
    }, Connection.ValOptions.SweepInterval);
}
