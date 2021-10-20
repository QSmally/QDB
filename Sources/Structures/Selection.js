
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
        const isInitialCollection = typeof entities === "function";

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

    /**
     * Sweeps the values that don't satisfy the provided function.
     * Identical to the `FILTER BY` SQL statement.
     * @param {Function} predicate A tester function which returns a boolean based on the properties of the row.
     * @returns {Selection}
     */
    filter(predicate) {
        for (const [keyContext, document] of this.cache) {
            if (!predicate(document, keyContext, this))
                this.cache.delete(keyContext);
        }

        return this;
    }

    /**
     * Slices off values which are out of the bounds of the limit statement.
     * Identical to the `LIMIT` SQL statement.
     * @param {Number} [extractionStartOffset] An index to start with filtering the entries, defaults to 0 if only an amount is given.
     * @param {Number} amount The amount to limit the Selection to. It can be placed at the offset parameter, which then starts at index 0.
     * @returns {Selection}
     */
    limit(extractionStartOffset, amount) {
        if (!amount) {
            amount = extractionStartOffset;
            extractionStartOffset = 0;
        }

        let pointer = 0;

        for (const [keyContext] of this.cache) {
            if (extractionStartOffset > pointer && pointer >= extractionStartOffset + amount)
                this.cache.delete(keyContext);
            pointer++;
        }
    }

    /**
     * Groups the Selection's values based on a particular property.
     * Identical to the `GROUP BY` SQL statement.
     * @param {Pathlike} pathlike Specifies which row or nested property to group by.
     * @returns {Selection}
     */
    group(pathlike) {
        const [_, path] = Generics.resolveKeyPath(pathlike);
        const originalSelectionObject = this.cache.toPairObject();
        this.cache.clear();

        for (const index in originalSelectionObject) {
            const documentObject = originalSelectionObject[index];
            const property = Generics.pathCast(documentObject, path);
            const existingGroup = this.cache.get(property);

            existingGroup ?
                existingGroup[index] = documentObject :
                this.cache.set(property, { [index]: documentObject });
        }

        return this;
    }

    // Utility methods
    // ... map, merge, clone
}

module.exports = Selection;
