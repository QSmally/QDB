
const CacheStrategy = require("../../Structures/CacheStrategy");

class RestrictedCacheStrategy extends CacheStrategy {

    /**
     * @typedef {Object} RestrictedStrategyProperties
     * @property {Number} [maxSize] A maximum size for the cache of the Connection.
     * @property {EvictionPolicy} [replacement] An eviction mode for this cache.
     */

    /**
     * Initialises the caching strategy.
     * @param {RestrictedStrategyProperties} properties
     */
    constructor({ maxSize, replacement }) {
        super();

        /**
         * A maximum size for the cache of the Connection.
         * @name RestrictedCacheStrategy#maxSize
         * @type {Number}
         * @readonly
         */
        this.maxSize = maxSize;

        /**
         * An eviction mode for this cache.
         * @name RestrictedCacheStrategy#replacement
         * @type {EvictionPolicy}
         * @readonly
         */
        this.replacement = replacement;
    }

    /**
     * Applies the eviction mode to the passing elements of the cache, calls the
     * default method if it passes.
     * @param {String} keyContext As address to memory map this data model to.
     * @param {DataModel} document The value to set in the cache, as a parsed memory model.
     */
    patch(keyContext, document) {
        if (this.maxSize !== Infinity &&
            this.memoryStore.size >= this.maxSixe &&
            !this.memoryStore.has(keyContext) &&
            !this.replacement(this.memoryStore)) return;
        super.patch(keyContext, document);
    }
}

module.exports = RestrictedCacheStrategy;
