
const { deserialize, serialize } = require("v8");

/**
 * A shorthand to cloning data models using the serialisation API of v8.
 * @param {DataModel} dataObject A structure to copy.
 * @returns {DataModel}
 */
module.exports = dataObject => {
    return deserialize(serialize(dataObject));
}
