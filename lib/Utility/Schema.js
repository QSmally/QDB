
"use strict";

const { DataStore } = require("qulity");

const modelStore = new DataStore();

class Schema {

    /**
     * A generic model that entries of a database automatically follows.
     * @param {String} identifier An identifier for this Schema Model.
     * @param {Object|Array} model An object or array, giving the layout and default values of entries.
     * @param {Function} [serialiser] A transformer object to implement, as a utility to fetch from some type of API or DataModel.
     */
    constructor (identifier, model, serialiser = undefined) {
        if (typeof identifier !== "string")                 throw new Error("Schema identifier should be a type of String.");
        if (typeof model !== "object")                      throw new Error("Schema Models should be a type of Object or Array.");
        if (serialiser && typeof serialiser !== "function") throw new Error("Schema Serialisers should be a Function which returns an Object or Array.");

        /**
         * The default model of this Schema.
         * @name Schema#model
         * @type {Object|Array}
         * @readonly
         */
        Object.defineProperty(this, "model", {
            enumerable: true,
            value: model
        });

        /**
         * A Serialiser function that converts an
         * entry to a rich DataModel on request.
         * @name Schema#_serialiser
         * @type {Function?}
         * @private
         */
        Object.defineProperty(this, "_serialiser", {
            enumerable: true,
            value: serialiser
        });

        modelStore.set(identifier, this);
    }


    /**
     * Serialises a supposed database entry to this Schema's rich DataModel,
     * if this Schema was instantiated with a Serialiser method.
     * @name Schema#serialise
     * @type {Function}
     */
    get serialise () {
        return typeof this._serialiser === "function" ?
            this._serialiser :
            model => ({ ...model });
    }

    /**
     * Public method.
     * Integrates an entry object and integrates them with this Schema's Model.
     * @param {Object} target The main entry to compare against and to merge changes into.
     * @returns {Object} A merged data object based on this Schema's Model.
     */
    Instance (target = {}) {

        // Depth Object Control
        // The object with the depth of 0 (root object) is always controlled fully (deleted and filled).
        // If a subobject (with a depth > 0) of the Schema has content in it, it will also fully control that.
        // If it doesn't, then it will not delete nor fill the target object.
        // Arrays are never deleted or filled (regardless if it's filled in the schema, as it's a default).

        (function copy (target, schema) {
            if (schema instanceof Array) {
                return target instanceof Array ?
                    [] :
                    target = [];
            } else if (target instanceof Array) {
                target = {};
            }

            if (Object.keys(schema).length === 0) return;

            Object.keys(target).forEach(key => {
                if (!schema.hasOwnProperty(key))
                delete target[key];
            });

            Object.keys(schema).forEach(key => {
                const schemaVal = schema[key];
                const targetVal = target[key];

                if (!target.hasOwnProperty(key)) target[key] = schemaVal;
                else if (schemaVal && typeof schemaVal === "object") copy(targetVal, schemaVal);
            });
        })(target, this.model);

        return target;
    }
    
}

module.exports = {
    Schema,
    modelStore
};
