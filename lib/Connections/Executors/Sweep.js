
/**
 * Sweep manager of the Connection, according to given options.
 * Disabled when the Connection's cache option is false.
 * @param {Connection} connection Reference to this Executor's Connection.
 * @returns {Function?} Interval identifier to clear on disconnect.
 */
module.exports = connection => {
    if (!connection.valOptions.cache) return null;

    const {
        sweepLifetime: lifetime,
        sweepInterval: interval
    } = connection.valOptions;

    return setInterval(() => {
        const time = Date.now();
        connection.memory.each((entry, key) => {
            if (time - entry._timestamp >= lifetime)
                connection.memory.delete(key);
        });
    }, interval);
}
