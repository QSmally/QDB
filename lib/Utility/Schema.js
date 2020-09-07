
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
        if (Serialiser && typeof Serialiser !== "function") throw new Error("Schema Serialiers should be a Function which returns an Object or Array.");

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
     * Serialise a database entry to
     * this Schema's rich DataModel.
     * @name Schema#Serialise
     * @type {Function}
     */
    get Serialise () {
        if (this.Serialiser) return this.Serialiser;
        else return Model => Model
    }

    /**
     * Public method.
     * Integrates an entry object and merges them with this Schema's Model.
     * @param {Object} Target A main entry object to compare against, and to integrate changes to.
     * @returns {Object} A merged object, based on this Schema's Model.
     */
    Migrate (Target = {}) {
        (function Copy(Target, Current) {
            Object.keys(Target).forEach(Key => {
                if (!Current.hasOwnProperty(Key))
                delete Target[Key];
            });

            Object.keys(Current).forEach(Key => {
                const Value = Current[Key];
                if (!Current.hasOwnProperty(Key)) return;
                if (Key === "__proto__") return;
        
                if (Target instanceof Array && Current instanceof Array) return;
                
                const Val = Target[Key];
                if (!Target.hasOwnProperty(Key)) Target[Key] = Value;
                else if (typeof Value === "object") Copy(Val, Value);
            });
        })(Target, this.Model);

        return Target;
    }
    
}

module.exports = {
    Schema,
    ModelStore
};
