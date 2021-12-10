
const BaseCacheStrategy = require("../Structures/BaseCacheStrategy");

module.exports = {

    /**
     * A default cache strategy which sets up a scheduler to sweep memory entries
     * older than some age, every some interval.
     * @param {ManagedStrategyProperties} [properties] Behavioural properties of this caching strategy.
     * @returns {ManagedCacheStrategy}
     */
    managed({
        interval = 3e5,
        lifetime = 9e5,
        maxSize = Infinity
    } = {}) {
        const ManagedCacheStrategy = require("./CacheStrategies/ManagedCacheStrategy");
        return new ManagedCacheStrategy({ interval, lifetime, maxSize });
    },

    /**
     * A caching strategy with a maximum size, but not automatic sweeping.
     * @param {RestrictedStrategyProperties} [properties] Behaviour properties of this caching strategy.
     * @returns {RestrictedCacheStrategy}
     */
    restricted({
        maxSize = Infinity
    } = {}) {
        const RestrictedCacheStrategy = require("./CacheStrategies/RestrictedCacheStrategy");
        return new RestrictedCacheStrategy({ maxSize });
    },

    /**
     * Applies no cache to the target Connection.
     * @returns {DisabledCacheStategy}
     */
    none() {
        const DisabledCacheStategy = require("./CacheStrategies/DisabledCacheStrategy");
        return new DisabledCacheStategy();
    },

    /**
     * A caching strategy with no sweeping or automatic eviction logic
     * implemented.
     * @returns {BaseCacheStrategy}
     */
    unlimited() {
        return new BaseCacheStrategy();
    }
};
