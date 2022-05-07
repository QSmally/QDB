
module.exports = {

    /**
     * A strategy which sorts entities in ascending order.
     * @param {Function} selector A function which returns a property to compare with.
     * @returns {Function}
     */
    ascending(selector) {
        return (node_0, node_1) => selector(node_0) > selector(node_1);
    },

    /**
     * A strategy which sorts entities in descending order.
     * @param {Function} selector A function which returns a property to compare with.
     * @returns {Function}
     */
    descending(selector) {
        return (node_0, node_1) => selector(node_0) < selector(node_1);
    }
};
