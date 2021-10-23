
class SortingPredicate {

    /**
     * A strategy which sorts entities in ascending order.
     * @param {Function} selector A function returns a property to compare with.
     * @returns {Function}
     */
    static ascending(selector) {
        return (node_0, node_1) => selector(node_0) > selector(node_1);
    }

    /**
     * A strategy which sorts entities in descending order.
     * @param {Function} selector A function which returns a property to compare with.
     * @returns {Function}
     */
    static descending(selector) {
        return (node_0, node_1) => selector(node_0) < selector(node_1);
    }
}

module.exports = SortingPredicate;
