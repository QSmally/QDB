
const CacheStrategy = require("../CacheStrategy");

class ManagedCacheStrategy extends CacheStrategy {

    /**
     * @typedef {Object} ManagedStrategyProperties
     * @property {Number} [interval] An interval at which to sweep the cache at, depending on the lifetime of entries.
     * @property {Number} [lifetime] The minimum lifetime of a data model entry before being able to be swept at an interval.
     * @property {Number} [maxSize] A maximum size for the cache of the Connection.
     */

    /**
     * Initialises the caching strategy.
     * @param {ManagedStrategyProperties} properties
     */
    constructor({ interval, lifetime, maxSize }) {
        super();

        /**
         * An interval at which to sweep the cache at, depending on the lifetime of entries.
         * @name ManagedCacheStrategy#interval
         * @type {Number}
         * @readonly
         */
        this.interval = interval;

        /**
         * The minimum lifetime of a data model entry before being able to be swept at an interval.
         * @name ManagedCacheStrategy#lifetime
         * @type {Number}
         * @readonly
         */
        this.lifetime = lifetime;

        /**
         * A maximum size for the cache of the Connection.
         * @name ManagedCacheStrategy#maxSize
         * @type {Number}
         * @readonly
         */
        this.maxSixe = maxSize;
    }

    /**
     * A scheduler which holds track of sweeping elements of the cache.
     * @name ManagedCacheStrategy#timer
     * @type {NodeJS.Timer}
     * @readonly
     */
    timer = setInterval(() => this.onSweepTick(), this.interval);

    /**
     * Is called on each iteration of the timer. Sweeps the items which are older than the set lifetime of this strategy.
     * @private
     */
    onSweepTick() {
        const now = Date.now();
        this.memory
            .filter(entry => now - entry._timestamp >= this.lifetime)
            .each((_, keyContext) => this.memory.delete(keyContext));
    }

    /**
     * Applies the eviction mode to the passing elements of the cache, calls the default method if it passes.
     * @param {String} keyContext As address to memory map this data model to.
     * @param {DataModel} document The value to set in the cache, as a parsed memory model.
     */
    patch(keyContext, document) {
        if (this.maxSize !== Infinity &&
            this.cache.size >= this.maxSixe &&
            !this.memory.has(keyContext)) return;
        super.patch(keyContext, document);
    }
}

module.exports = ManagedCacheStrategy;
