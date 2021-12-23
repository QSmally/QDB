
"use strict";

const { Collection } = require("qulity");

const Generics     = require("../Generics");
const JoinStrategy = require("../Enumerations/JoinStrategy");

class Selection {

    /**
     * An unchanged piece of the database in working memory.
     * @param {Object|Collection} entities The initial set of elements for this Selection instance.
     * @param {String} holds A table name as reference for this Selection to hold.
     */
    constructor(entities, holds) {
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

    /**
     * Sorts the values of this Selection by some property.
     * Identical to the `ORDER BY` SQL statement.
     * @param {SortingPredicate} predicateType A predicate which sorts the Selection's entities based on a property, or a custom function which determines the order.
     * @returns {Selection}
     */
    order(predicateType) {
        this.cache.sort(predicateType);
        return this;
    }

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

        return this;
    }

    /**
     * Groups the Selection's values based on a particular property.
     * Identical to the `GROUP BY` SQL statement.
     * @param {Pathlike} pathlike Specifies which row or nested property to group by.
     * @returns {Selection}
     */
    group(pathlike) {
        const [key, path] = Generics.resolveKeyPath(pathlike);
        const originalSelectionObject = this.cache.toPairObject();
        this.cache.clear();

        for (const index in originalSelectionObject) {
            const documentObject = originalSelectionObject[index];
            const property = Generics.pathCast(documentObject, [key, ...path]);
            const existingGroup = this.cache.get(property);

            existingGroup ?
                existingGroup[index] = documentObject :
                this.cache.set(property, { [index]: documentObject });
        }

        return this;
    }

    /**
     * Joins another Selection into this instance based on a referrer field.
     * Identical to the `FULL JOIN` SQL statement.
     * @param {Selection} secondarySelection Another Selection instance to be joined into this one.
     * @param {JoinStrategy} [joinStrategy] A strategy to decide how to join the documents into this Selection's documents, defaults to the secondary Selection's table name.
     * @param {Pathlike} [field] A path to some property to reference how to join the secondary Selection. If none, the key of the document is used.
     * @returns {Selection}
     */
    join(secondarySelection, joinStrategy = JoinStrategy.property(secondarySelection.holds), field = null) {
        const [key, path] = field ?
            Generics.resolveKeyPath(field) :
            [[], []];

        for (const [index, joinObject] of Generics.clone(secondarySelection.cache)) {
            const fieldId = field ?
                Generics.pathCast(joinObject, [key, ...path]) :
                index;
            const documentObject = this.cache.get(fieldId);
            if (documentObject) joinStrategy(documentObject, index, joinObject);
        }

        return this;
    }

    // Utility methods

    /**
     * Iterates over this Selection's entries and implements the new values
     * returned from the callback.
     * @param {Function} transformer A function which returns the new states of the iterating rows.
     * @returns {Selection}
     */
    map(transformer) {
        for (const [keyContext, document] of this.cache)
            this.cache.set(keyContext, transformer(document, keyContext));
        return this;
    }

    /**
     * Automatically clones the merging Selections and adds them into this
     * instance.
     * @param {...Selection} selections Selection instances to be cloned and merged into this one.
     * @returns {Selection}
     */
    merge(...selections) {
        for (const selection of selections) {
            for (const [keyContext, document] of Generics.clone(selection.cache))
                this.cache.set(keyContext, document);
        }

        return this;
    }

    /**
     * Creates a new memory allocation for a copy of this Selection.
     * @param {String} [holds] An optional new identifier for the cloned Selection.
     * @returns {Selection}
     */
    clone(holds = null) {
        return new Selection(this.cache.toPairObject(), holds ?? this.holds);
    }
}

module.exports = Selection;
