
const clone = require("rfdc")();

/**
 * A shorthand to cloning data models using RFDC.
 * @param {DataModel} dataObject A structure to copy.
 * @returns {DataModel}
 */
module.exports = dataObject => {
    return clone(dataObject);
}
