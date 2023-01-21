
module.exports = {

    /**
     * A subroutine to describe the sorting strategy.
     * @typedef {Function} SortStrategy
     */

    /**
     * A strategy which sorts entities in ascending order.
     * @param {Function} selector A function which returns a property to compare with.
     * @returns {SortStrategy}
     */
    ascending(selector) {
        return (node_0, node_1) => selector(node_0) > selector(node_1) ? 1 : -1;
    },

    /**
     * A strategy which sorts entities in descending order.
     * @param {Function} selector A function which returns a property to compare with.
     * @returns {SortStrategy}
     */
    descending(selector) {
        return (node_0, node_1) => selector(node_0) < selector(node_1) ? 1 : -1;
    }
};
