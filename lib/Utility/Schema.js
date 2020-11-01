
"use strict";

const {DataStore} = require("qulity");
const ModelStore  = new DataStore();

class Schema {

    /**
     * A general model that entries of a database should follow.
     * @param {String} Id An identifier for this Schema Model.
     * @param {Object|Array} Model An object or array, giving the layout and default values of entries.
     * @param {Function} [Serialiser] A transformer object to implement, as a utility to fetch from some type of API or DataModel.
     */
    constructor (Id, Model, Serialiser = undefined) {

        if (typeof Id !== "string")                         throw new Error("Schema identifier should be a type of String.");
        if (typeof Model !== "object")                      throw new Error("Schema Models should be a type of Object or Array.");
        if (Serialiser && typeof Serialiser !== "function") throw new Error("Schema Serialisers should be a Function which returns an Object or Array.");

        /**
         * The default model of this Schema.
         * @name Schema#Model
         * @type {Object|Array}
         * @readonly
         */
        Object.defineProperty(this, "Model", {
            enumerable: true,
            value: Model
        });

        /**
         * A Serialiser function that converts an
         * entry to a rich DataModel on request.
         * @name Schema#Serialiser
         * @type {Function?}
         * @private
         */
        Object.defineProperty(this, "Serialiser", {
            enumerable: true,
            value: Serialiser
        });

        ModelStore.set(Id, this);

    }


    /**
     * Serialises a supposed database entry to this Schema's rich DataModel,
     * if this Schema was instantiated with a Serialiser method.
     * @name Schema#Serialise
     * @type {Function}
     */
    get Serialise () {
        if (this.Serialiser) return this.Serialiser;
        else return Model => Model;
    }

    /**
     * Public method.
     * Integrates an entry object and integrates them with this Schema's Model.
     * @param {Object} Target The main entry to compare against and to merge changes into.
     * @returns {Object} A merged data object based on this Schema's Model.
     */
    Instance (Target = {}) {

        // Depth Object Control
        // The object with the depth of 0 (root object) is always controlled fully (deleted and filled)
        // If a subobject (with a depth > 0) of the schema has content in it, it will also fully controle that
        // If it doesn't, then it will not delete nor fill the target object
        // Arrays are never deleted or filled (... regardless if it's filled in the schema, as it's a default)

        (function Copy (Target, Schema) {

            if (Schema instanceof Array) {
                if (Target instanceof Array) return;
                else return Target = [];
            } else if (Target instanceof Array) Target = {};

            if (Object.keys(Schema).length === 0) return;

            Object.keys(Target).forEach(Key => {
                if (!Schema.hasOwnProperty(Key))
                delete Target[Key];
            });

            Object.keys(Schema).forEach(Key => {
                const SchemaVal = Schema[Key];
                const TargetVal = Target[Key];

                if (!Target.hasOwnProperty(Key)) Target[Key] = SchemaVal;
                else if (SchemaVal && typeof SchemaVal === "object") Copy(TargetVal, SchemaVal);
            });

        })(Target, this.Model);

        return Target;
    }
    
}

module.exports = {
    Schema,
    ModelStore
};
