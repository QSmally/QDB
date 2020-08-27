
"use strict";

const {DataStore} = require("qulity");
const ModelStore  = new DataStore();

class Schema {

    /**
     * A general scheme model that entries of a database should follow.
     * @param {String} Id An identifier for this scheme model.
     * @param {Object|Array} Model An object or array, giving the layout and default values of entries.
     * @param {Function} Serialiser A transformer object to implement, as a utility to fetch from some type of API or DataModel.
     */
    constructor (Id, Model, Serialiser = undefined) {

        if (typeof Id !== "string")                         throw new Error("Schema identifier should be a type of String.");
        if (typeof Model !== "object")                      throw new Error("Schema Models should be a type of Object or Array.");
        if (Serialiser && typeof Serialiser !== "function") throw new Error("Schema Serialiers should be a Function which returns an Object or Array.");

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
         * @type {Function|undefined}
         * @readonly
         */
        Object.defineProperty(this, "Serialiser", {
            enumerable: true,
            value: Serialiser
        });

        ModelStore.set(Id, this);

    }


    /**
     * Public method.
     * Integrates multiple objects and merges them into one final object.
     * @param {Object} Target A main target object to compare against, and to integrate changes to.
     * @param {...Object} Objects A list of objects to merge into the target object.
     * @returns {Object} An output object, based on the target.
     */
    static Merge (Target = {}, ...Objects) {
        if (!(Objects instanceof Array)) return Target;

        function Copy(Target, Current) {
            Object.keys(Current).forEach(Key => {
                const Value = Current[Key];
                if (!Current.hasOwnProperty(Key)) return;
                if (Key === "__proto__") return;
        
                if (Target instanceof Array && Current instanceof Array) return;
                
                const Val = Target[Key];
                if (!Target.hasOwnProperty(Key)) Target[Key] = Value;
                else if (typeof Value === "object") DefaultsDeep(Val, Value);
            });
        }

        for (let i in Objects) {
            const Obj = Objects[i];
            if (Obj) Copy(Target, Obj);
        }
    
        return Target;
    }
    
}

module.exports = {
    Schema,
    ModelStore
};
