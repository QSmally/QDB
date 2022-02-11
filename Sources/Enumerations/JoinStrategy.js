
module.exports = {

    /**
     * A strategy which flattens any keys into the document itself.
     * @returns {Function}
     */
    flatten() {
        return (documentObject, keyContext, value) => {
            documentObject[keyContext] = value;
        }
    },

    /**
     * A strategy which assigns all the joined documents to a particular property.
     * @param {String} name The name of the property to insert the joined documents into.
     * @returns {Function}
     */
    property(name) {
        return (documentObject, keyContext, value) => {
            documentObject.hasOwnProperty(name) ?
                documentObject[name][keyContext] = value :
                documentObject[name] = { [keyContext]: value };
        }
    }
};
