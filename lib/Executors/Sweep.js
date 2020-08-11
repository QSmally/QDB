
/**
 * Sweep manager of the Connection, according to given options.
 * @param {Connection} Connection 
 * @returns {Function}
 */
module.exports = Connection => {
    return setInterval(() => {
        const Amount = Connection.Cache.sweep(e => Date.now() - e._Timestamp >= this.ValOptions.SweepLifetime);
        Connection._EventHandler.emit("Sweep", Amount);
    }, Connection.ValOptions.SweepInterval);
}
