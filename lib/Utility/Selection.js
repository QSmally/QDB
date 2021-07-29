
"use strict";

const { Collection } = require("qulity");

class Selection {

    /**
     * An unchanged piece of the database in memory, to use
     * as baseline of various endpoints to execute functions with.
     * @param {Object} _entries Initial selection of entries for this Selection instance.
     * @param {String} _holds Reference to the table this Selection will hold.
     * @example const Selection = MyDB.Select(User => User.Age > 20);
     */
    constructor (_entries, _holds) {
        /**
         * Cached dataset of this Selection.
         * @name Selection#cache
         * @type {Collection}
         * @link https://github.com/QSmally/Qulity/blob/master/Documentation/Collection.md
         * @readonly
         */
        Object.defineProperty(this, "cache", {
            enumerable: true,
            value: new Collection()
        });

        for (const id in _entries)
            this.cache.set(id, _entries[id]);

        /**
         * Reference to the table this Selection holds.
         * @name Selection#holds
         * @type {String}
         * @readonly
         */
        Object.defineProperty(this, "holds", {
            enumerable: true,
            value: _holds
        });
    }


    /**
     * Serialises this Selection's keys into an array.
     * @name Selection#keys
     * @type {Array}
     */
    get keys () {
        return this.cache.toKeyArray();
    }

    /**
     * Serialises this Selection's values into an array.
     * @name Selection#values
     * @type {Array}
     */
    get values () {
        return this.cache.toArray();
    }

    /**
     * Serialises this Selection into an object.
     * @name Selection#asObject
     * @type {Object}
     */
    get asObject () {
        return this.cache.toPairObject();
    }


    /**
     * Returns the given document by its key from this Selection.
     * @param {Pathlike} keyOrPath Indicates which (nested) element to receieve.
     * @returns {Object|Array|DataModel}
     */
    retrieve (keyOrPath) {
        if (typeof keyOrPath !== "string") return null;
        const [key, ...path] = keyOrPath.split(".");
        const documentObject = this.cache.get(key);

        if (!path.length) return documentObject;
        return this._castPath(documentObject, path);
    }


    // ---------------------------------------------------------------- Private methods

    /**
     * Internal method.
     * Finds a relative dotaccess pathway of an object.
     * @param {Object|Array} frame The object-like beginning to cast.
     * @param {Array} pathlike A dotaccess notation path, as an Array split by dots.
     * @returns {*} Returns the output of the caster.
     * @private
     */
    _castPath (frame, pathlike) {
        const lastFrameKey = pathlike.pop();

        for (const key of pathlike) {
            if (typeof frame !== "object") return;
            if (!(key in frame)) return;
            frame = frame[key];
        }

        return frame ?
            frame[lastFrameKey] :
            undefined;
    }


    // ---------------------------------------------------------------- SQL methods

    /**
     * Sorts this Selection's values.
     * Identical to the `ORDER BY` SQL statement.
     * @param {Function} predicate Function that determines the sort order with given arguments `a` and `b`.
     * @returns {Selection}
     */
    order (predicate) {
        if (typeof predicate === "function")
            this.cache.sort(predicate, this);
        return this;
    }

    /**
     * Filters values that satisfy the provided function.
     * Identical to the `FILTER BY` SQL statement.
     * @param {Function} predicate Function that determines which entries to keep.
     * @returns {Selection}
     */
    filter (predicate) {
        if (typeof predicate === "function") {
            predicate = predicate.bind(this);
            for (const [key, documentObject] of this.cache) {
                if (!predicate(documentObject, key, this))
                    this.cache.delete(key);
            }
        }

        return this;
    }

    /**
     * Slices off values from this Selection.
     * Identical to the `LIMIT` SQL statement.
     * @param {Number} begin Index that indicates the beginning to slice.
     * @param {Number} [end] An index for the end of the slice.
     * @returns {Selection}
     */
    limit (begin, end = undefined) {
        if (typeof begin !== "number")      return this;
        if (end && typeof end !== "number") return this;
        if (!end) end = this.cache.size;

        let i = 0;

        for (const key of this.cache) {
            if (i < begin || i >= end)
                this.cache.delete(key[0]);
            i++;
        }

        return this;
    }

    /**
     * Groups this Selection based on an identifier.
     * Identical to the `GROUP BY` SQL statement.
     * @param {Pathlike} keyOrPath Determines by which property to group this Selection.
     * @returns {Selection}
     */
    group (keyOrPath) {
        if (typeof keyOrPath !== "string") return null;
        const originalSelection = this.cache.toPairObject();
        this.cache.clear();

        for (const idx in originalSelection) {
            const row = originalSelection[idx];
            const field = this._castPath(row, keyOrPath.split(/\.+/g));
            const group = this.cache.get(field);

            if (group) {
                group[idx] = row;
                this.cache.set(field, group);
            } else {
                this.cache.set(field, { [idx]: row });
            }
        }

        return this;
    }

    /**
     * Joins another Selection into this instance based on a referrer field.
     * Identical to the `FULL JOIN` SQL statement.
     * @param {Selection} secondary Another Selection instance to join into this one.
     * @param {String} field Which field to check for a reference to this Selection's rows, or `null` to join with keys.
     * @param {Boolean|String} [property] Boolean false to flatten the entries into this Selection's rows,
     * a string value that implicitly indicates the property to add the merging entries,
     * or a boolean true to use the Selection's table name as property.
     * @returns {Selection}
     */
    join (secondary, field, property = true) {
        if (!(secondary instanceof Selection)) return null;
        if (typeof field !== "string" && field !== null) return null;

        const key = typeof property === "string" ? property : secondary.holds;
        if (property) this.map(entry => { entry[key] = {}; return entry; });

        for (const [id, documentObject] of secondary.cache) {
            const fieldId = field ? this._castPath(documentObject, field.split(/\.+/g)) : id;
            const origin = this.cache.get(fieldId);
            if (!origin) continue;

            !property ?
                origin[id] = documentObject :
                origin[key][id] = documentObject;
            this.cache.set(fieldId, origin);
        }

        return this;
    }


    // ---------------------------------------------------------------- Utility methods

    /**
     * Iterates over this Selection's values and keys, and implements the new values returned from the callback.
     * @param {Function} fn Callback function which determines the new values of the Selection.
     * @returns {Selection}
     */
    map (fn) {
        if (typeof fn !== "function") return null;
        let i = 0;

        for (const [key, documentObject] of this.cache)
            this.cache.set(key, fn(documentObject, key, i++));

        return this;
    }

    /**
     * Automatically clones the merging Selections and adds them into this instance.
     * @param {...Selection} selections Instances to clone and merge into this one.
     * @returns {Selection}
     */
    merge (...selections) {
        if (!(selections instanceof Array)) return null;

        for (const sel of selections.map(sel => sel.clone()))
            for (const [key, documentObject] of sel.cache)
                this.cache.set(key, documentObject);

        return this;
    }

    /**
     * Creates a new memory allocation for the copy of this Selection.
     * @param {String} [holds] Optional new identifier value for the cloned Selection.
     * @returns {Selection}
     */
    clone (holds = undefined) {
        const { serialize, deserialize } = require("v8");
        const selectionPairs = deserialize(serialize(this.asObject));
        return new Selection(selectionPairs, holds || this.holds);
    }
}

module.exports = Selection;
