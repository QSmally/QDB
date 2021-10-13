
const BaseCacheStrategy = require("../Structures/BaseCacheStrategy");

class CacheStrategy {

    /**
     * A default cache strategy which sets up a scheduler to sweep memory entries
     * older than some age, every some interval.
     * @param {ManagedStrategyProperties} [properties] Behavioural properties of this caching strategy.
     * @returns {ManagedCacheStrategy}
     */
    static managed({
        interval = 3e5,
        lifetime = 9e5,
        maxSize = Infinity
    } = {}) {
        const ManagedCacheStrategy = require("./CacheStrategies/ManagedCacheStrategy");
        return new ManagedCacheStrategy({ interval, lifetime, maxSize });
    }

    /**
     * A caching strategy with a maximum size, but not automatic sweeping.
     * @param {RestrictedStrategyProperties} [properties] Behaviour properties of this caching strategy.
     * @returns {RestrictedCacheStrategy}
     */
    static restricted({
        maxSize = Infinity
    } = {}) {
        const RestrictedCacheStrategy = require("./CacheStrategies/RestrictedCacheStrategy");
        return new RestrictedCacheStrategy({ maxSize });
    }

    /**
     * Applies no cache to the target Connection.
     * @returns {DisabledCacheStategy}
     */
    static none() {
        const DisabledCacheStategy = require("./CacheStrategies/DisabledCacheStrategy");
        return new DisabledCacheStategy();
    }

    /**
     * A caching strategy with no sweeping or automatic eviction logic
     * implemented.
     * @returns {BaseCacheStrategy}
     */
    static unlimited() {
        return new BaseCacheStrategy();
    }
}

module.exports = CacheStrategy;
