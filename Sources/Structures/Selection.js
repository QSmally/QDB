
"use strict";

const { Collection } = require("qulity");

const Generics = require("../Generics");

class Selection {

    /**
     * An unchanged piece of the database in working memory.
     * @param {Object|Collection} entities The initial selection of elements for this Selection instance.
     * @param {String} holds A table name as reference for this Selection to hold.
     */
    constructor(entities, holds) {
        // TODO:
        // 'typeof' is a generally faster method of retrieving the abstract
        // type of an object, and 'Collection' is a function as opposed to
        // an object (although Maps are objects).
        const isInitialCollection = entities instanceof Collection;

        /**
         * Cached entities of this Selection.
         * @name Selection#cache
         * @type {Collection}
         * @readonly
         */
        this.cache = isInitialCollection ?
            entities :
            new Collection();

        if (!isInitialCollection) {
            for (const keyContext in entities)
                this.cache.set(keyContext, entities[keyContext]);
        }

        /**
         * A reference to the table name this Selection holds.
         * @name Selection#holds
         * @type {String}
         * @readonly
         */
        this.holds = holds;
    }

    /**
     * Retrieves an array of keys of the Selection.
     * @name Selection#indexes
     * @type {Array}
     * @readonly
     */
    get indexes() {
        return this.cache.toKeyArray();
    }

    /**
     * Retrives an array of the values of the Selection.
     * @name Selection#documents
     * @type {Array}
     * @readonly
     */
    get documents() {
        return this.cache.toArray();
    }

    /**
     * Manages individual retrieval of the Selection.
     * @param {Pathlike} pathlike Specifies which row or nested property to retrieve from the Selection.
     * @returns {*}
     */
    retrieve(pathlike) {
        const [keyContext, path] = Generics.resolveKeyPath(pathlike);
        const documentObject = this.cache.get(keyContext);

        return path.length ?
            Generics.pathCast(documentObject, path) :
            documentObject;
    }

    // SQL methods
    // ... order, filter, limit, group, join

    // Utility methods
    // ... map, merge, clone
}

module.exports = Selection;
