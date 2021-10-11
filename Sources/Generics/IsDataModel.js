
/**
 * Returns whether or not an entry conforms to being a data model's root.
 * @param {*} dataObject An entry which can be a data model.
 * @returns {Boolean}
 */
module.exports = dataObject => {
    return dataObject && typeof dataObject === "object";
}
