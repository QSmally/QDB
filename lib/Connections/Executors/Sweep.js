
/**
 * Sweep manager of the Connection, according to given options.
 * Disabled when the Connection's cache option is false.
 * @param {Connection} Connection Reference to this Executor's Connection.
 * @returns {Function?} Interval identifier to clear on disconnect.
 */
module.exports = Connection => {

    if (!Connection.ValOptions.Cache) return null;

    const {
        SweepLifetime: Lifetime,
        SweepInterval: Interval
    } = Connection.ValOptions;

    return setInterval(() => {
        const Time = Date.now();
        Connection.Cache.each((Entry, Key) => {
            if (Time - Entry._Timestamp >= Lifetime)
            Connection.Cache.delete(Key);
        });
    }, Interval);

}
