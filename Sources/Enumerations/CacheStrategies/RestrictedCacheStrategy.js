
const BaseCacheStrategy = require("../../Structures/BaseCacheStrategy");

class RestrictedCacheStrategy extends BaseCacheStrategy {

    /**
     * @typedef {Object} RestrictedStrategyProperties
     * @property {Number} [maxSize] A maximum size for the cache of the Connection.
     */

    /**
     * Initialises the caching strategy.
     * @param {RestrictedStrategyProperties} properties
     */
    constructor({ maxSize }) {
        super();

        /**
         * A maximum size for the cache of the Connection.
         * @name RestrictedCacheStrategy#maxSize
         * @type {Number}
         * @readonly
         */
        this.maxSize = maxSize;
    }

    /**
     * Applies the eviction mode to the passing elements of the cache, calls the
     * default method if it passes.
     * @param {String} keyContext As address to memory map this data model to.
     * @param {DataModel} document The value to set in the cache, as a parsed memory model.
     */
    patch(keyContext, document) {
        if (this.maxSize !== Infinity &&
            this.memory.size >= this.maxSixe &&
            !this.memory.has(keyContext)) return;
        super.patch(keyContext, document);
    }
}

module.exports = RestrictedCacheStrategy;
