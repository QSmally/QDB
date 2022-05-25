
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
    }
};
