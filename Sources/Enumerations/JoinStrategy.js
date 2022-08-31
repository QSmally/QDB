
module.exports = {

    /**
     * A subroutine to describe the insertion of joined properties.
     * @typedef {Function} JoinStrategy
     */

    /**
     * A strategy which flattens any keys into the document itself.
     * @returns {JoinStrategy}
     */
    flatten() {
        return (documentObject, keyContext, value) => {
            documentObject[keyContext] = value;
        }
    },

    /**
     * A strategy which assigns all the joined documents to a particular property.
     * @param {String} name The name of the property to insert the joined documents into.
     * @returns {JoinStrategy}
     */
    property(name) {
        return (documentObject, keyContext, value) => {
            documentObject.hasOwnProperty(keyContext) ?
                documentObject[keyContext][name] = value :
                documentObject[keyContext] = { [name]: value };
        }
    }
};
