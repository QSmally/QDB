
"use strict";

class Schema {

    /**
     * A general scheme model that entries of a database should follow.
     * @param {Object|Array} Model An object or array, giving the layout and default values of entries.
     * @param {Function} Serialiser A transformer object to implement, as a utility to fetch from some type of API or DataModel.
     */
    constructor (Model, Serialiser = undefined) {

        if (typeof Model !== "object")        throw new Error("Schema Models should be a type of Object or Array.");
        if (typeof Serialiser !== "function") throw new Error("Schema Serialiers should be a Function which returns an Object or Array.");

        /**
         * The default Model of this Schema.
         * @name Schema#Model
         * @type {Object|Array}
         * @readonly
         */
        Object.defineProperty(this, "Model", {
            enumerable: true,
            value: Model
        });

        /**
         * A Serialiser function that converts an entry
         * to a rich DataModel scheme on request.
         * @name Schema#Serialiser
         * @type {Function}
         * @readonly
         */
        Object.defineProperty(this, "Serialiser", {
            enumerable: true,
            value: Serialiser
        });

    }
    
}

module.exports = Schema;
