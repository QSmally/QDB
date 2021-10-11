
const { Collection } = require("qulity");

const Generics = require("../Generics");

class CacheStrategy {

    /**
     * A default cache strategy which sets up a scheduler to sweep memory entries older than some age, every some interval.
     * @param {SweepStrategyProperties} [properties] Behavioural properties of this caching strategy.
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
     * A caching strategy which automatically moves all entries of the database into working memory.
     * @returns {FetchAllCacheStrategy}
     */
    static fetchAll() {
        // TODO:
        // Implement the fetch-all caching strategy class.
        return new CacheStrategy();
    }

    /**
     * A caching strategy with no sweeping or automatic eviction logic implemented.
     * @returns {CacheStrategy}
     */
    static unlimited() {
        return new CacheStrategy();
    }

    // Abstract default implementation

    /**
     * In-memory cached rows.
     * @name CacheStrategy#memory
     * @type {Collection<String, DataModel>}
     * @private
     */
    memory = new Collection();

    /**
     * Internal method.
     * Inserts or patches something in the Connection's internal cache.
     * @param {String} keyContext As address to memory map this data model to.
     * @param {DataModel} document The value to set in the cache, as a parsed memory model.
     * @abstract
     */
    patch(keyContext, document) {
        const documentClone = Generics.clone(document);
        documentClone._timestamp = Date.now();
        this.memory.set(keyContext, documentClone);
    }
}

module.exports = CacheStrategy;
