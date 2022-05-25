
module.exports = {

    /**
     * A subroutine to manage cache replacement.
     * @typedef {Function} EvictionPolicy
     */

    /**
     * The default eviction policy of any restricted cache. It will ignore any
     * entries after the maximum size of the memory has been exceeded. This is the
     * fastest replacement policy out of all, but might suffer from lack of cached
     * entities when fetching subsequent entries.
     * @returns {EvictionPolicy}
     */
    block() {
        return _memoryStore => false;
    },

    /**
     * Erases everything from the cache once the maximum size of the memory was
     * exceeded. Like the 'block' policy, this replacement policy is fast in terms
     * executing, but will suffer from lack of cached entities afterwards.
     * @returns {EvictionPolicy}
     */
    clear() {
        return memoryStore => {
            memoryStore.clear();
            return true;
        }
    },

    /**
     * Evicts the oldest living entity which was brought into this cache,
     * regardless of the time this element was lastly fetched.
     * @param {Number} amount An amount of entities to evict to make replacement calls less common.
     * @returns {EvictionPolicy}
     */
    fifo(amount = 5) {
        return memoryStore => {
            const keys = memoryStore.keys();
            for (let i = 0; i < amount; i++)
                memoryStore.delete(keys.next().value);
            return true;
        }
    }
};
