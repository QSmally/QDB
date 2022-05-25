
const RestrictedCacheStrategy = require("./RestrictedCacheStrategy");

class ManagedCacheStrategy extends RestrictedCacheStrategy {

    /**
     * @typedef {Object} ManagedStrategyProperties
     * @property {Number} [interval] An interval at which to sweep the cache at, depending on the lifetime of entries.
     * @property {Number} [lifetime] The minimum lifetime of a data model entry before being able to be swept at an interval.
     * @property {Number} [maxSize] A maximum size for the cache of the Connection.
     * @property {EvictionPolicy} [replacement] An eviction mode for this cache.
     */

    /**
     * Initialises the caching strategy.
     * @param {ManagedStrategyProperties} properties
     */
    constructor({ interval, lifetime, maxSize, replacement }) {
        super({ maxSize, replacement });

        /**
         * An interval at which to sweep the cache at, depending on the lifetime of
         * entries.
         * @name ManagedCacheStrategy#interval
         * @type {Number}
         * @readonly
         */
        this.interval = interval;

        /**
         * The minimum lifetime of a data model entry before being able to be swept
         * at an interval.
         * @name ManagedCacheStrategy#lifetime
         * @type {Number}
         * @readonly
         */
        this.lifetime = lifetime;
    }

    /**
     * A scheduler which holds track of sweeping elements of the cache.
     * @name ManagedCacheStrategy#timer
     * @type {NodeJS.Timer}
     * @readonly
     */
    timer = setInterval(() => this.onSweepTick(), this.interval);

    /**
     * Is called on each iteration of the timer. Sweeps the items which are older
     * than the set lifetime of this strategy.
     * @private
     */
    onSweepTick() {
        const now = Date.now();
        this.memoryStore
            .filter(entry => now - entry._timestamp >= this.lifetime)
            .each((_, keyContext) => this.memoryStore.delete(keyContext));
    }
}

module.exports = ManagedCacheStrategy;
