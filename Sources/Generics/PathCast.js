
/**
 * Finds a relative dot-separated pathway of a data model.
 * @param {DataModel} dataObject The object-like target.
 * @param {Array<String>} path A parsed array of a pathlike notation from 'resolveKeyPath'.
 * @param {*} [item] A value to place into the pathway endpoint.
 * @returns {*}
 */
module.exports = (dataObject, path, item) => {
    if (!path.length && item === undefined) {
        return dataObject;
    }

    const originalDataObject = dataObject;
    const finalKey = path.pop();

    for (const key of path) {
        if (typeof dataObject !== "object") return;
        if (!dataObject.hasOwnProperty(key) && item === undefined) return;
        if (!dataObject.hasOwnProperty(key)) dataObject[key] = {};

        dataObject = dataObject[key];
    }

    if (dataObject) {
        if (item === undefined) return dataObject[finalKey];
        dataObject[finalKey] = item;
        return originalDataObject;
    }
}
