
"use strict";

const { Collection } = require("qulity");

class Schema {

    /**
     * A dictionary of instantiated Schema models.
     * @name Schema#models
     * @type {Collection<String, Schema>}
     * @private
     */
    static models = new Collection();

    /**
     * The object which holds and controls data migration for a particular table.
     * @param {String} identifier Any name to give this model.
     * @param {DataModel} model An abstract representation of structure and default values for the schema.
     */
    constructor(identifier, model) {
        /**
         * An identifier for this model.
         * @name Schema#identifier
         * @type {String}
         * @readonly
         */
        this.identifier = identifier;

        /**
         * The default model of this Schema.
         * @name Schema#model
         * @type {DataModel}
         * @readonly
         */
        this.model = model;

        Schema.models.set(identifier, this);
    }

    /**
     * Ensures the type returning from this associated function.
     * @param {Schema|String} model Either a Schema model or string identifier of it.
     * @returns {Schema?}
     */
    static castType(model) {
        return typeof model === "string" ?
            Schema.models.get(model) :
            model;
    }

    /**
     * Depth Object Control:
     * - The root object is always controlled fully (deleted and filled);
     * - If an object with a depth > 0 has content in it, it will also fully control that;
     * - If it doesn't, it will not delete nor fill the target object;
     * - Arrays are never deleted or filled (regardless if it's filled in the model).
     * @param {DataModel} target The main entry to compare against and to merge changes into.
     * @param {DataModel?} model A model of some Schema to compare with.
     * @returns {DataModel}
     */
    instance(target, model = this.model) {
        if (model.constructor === Array)
            if (target.constructor !== Array) target = [];
        else if (target.constructor === Array)
            target = {};

        if (Object.keys(model).length === 0) return;

        for (const key of Object.keys(target)) {
            if (!model.hasOwnProperty(key)) delete target[key];
        }

        for (const key of Object.keys(model)) {
            if (!target.hasOwnProperty(key))
                target[key] = model[key];
            else if (model[key] && typeof model[key] === "object")
                this.instance(target[key], model[key]);
        }

        return target;
    }
}

module.exports = Schema;
