
"use strict";

class Selection {

    /**
     * An unchanged piece of the database in memory, to use
     * as baseline of various endpoints to execute functions with.
     * @param {Object} _Entries Initial selection of entries for this Selection instance.
     * @example const Selection = MyDB.Select(User => User.Age > 20);
     */
    constructor (_Entries) {
        
        /**
         * Cached dataset instances of this Selection.
         * @name Selection#Cache
         * @type {Map}
         * @readonly
         */
        Object.defineProperty(this, "Cache", {
            enumerable: true,
            value: new Map()
        });

        for (const Id in _Entries)
        this.Cache.set(Id, _Entries[Id]);

    }


    /**
     * Serialises this Selection's keys into an array.
     * @name Selection#Keys
     * @type {Array}
     */
    get Keys () {
        return this.Cache.toKeyArray();
    }

    /**
     * Serialises this Selection's values into an array.
     * @name Selection#Values
     * @type {Array}
     */
    get Values () {
        return this.Cache.toArray();
    }

    /**
     * Serialises this Selection into an object.
     * @name Selection#AsObject
     * @type {Object}
     */
    get AsObject () {
        return this.toObject();
    }


    // ---------------------------------------------------------------- SQL methods

    /**
     * Sorts this Selection's values.
     * Identical to the `SORT BY` SQL statement.
     * @param {Function} Fn Function that determines the sort order.
     * @returns {Selection}
     */
    Sort (Fn) {
        if (typeof Fn === "function")
        this.Cache.sort(Fn, this);
        return this;
    }

    /**
     * Filters values that satisfy the provided function.
     * Identical to the `FILTER BY` SQL statement.
     * @param {Function} Fn Function that determines which entries to keep.
     * @returns {Selection}
     */
    Filter (Fn) {
        if (typeof Fn === "function") {
            Fn = Fn.bind(this);
            for (const [Key, Val] of this.Cache)
            if (!Fn(Val, Key, this)) this.remove(Key);
        }

        return this;
    }

    /**
     * Slices off values from this Selection.
     * Identical to the `LIMIT` SQL statement.
     * @param {Number} Begin Integer to indicate the beginning to slice.
     * @param {Number} [End] Integer to indicate the end of the slice.
     * @returns {Selection}
     */
    Limit (Begin, End = undefined) {
        if (typeof Begin !== "number")      return this;
        if (End && typeof End !== "number") return this;
        if (!End) End = this.Cache.size;

        let i = 0;

        for (const Key of this.Cache) {
            if (i < Begin || i >= End)
            this.remove(Key[0]);
            i++;
        }

        return this;
    }

    /**
     * Groups this Selection based on an identifier.
     * Identical to the `GROUP BY` SQL statement.
     * @param {Pathlike} Key Indicates by which element to group this Selection.
     * @returns {Selection}
     */
    Group (Key) {
        if (typeof Key !== "string") return null;
        const Original = this.AsObject;
        this.Cache.clear();

        for (const Idx in Original) {
            const Row = Original[Idx];
            const Group = this.Cache.get(Row[Key]);

            if (Group) {
                Group[Idx] = Row;
                this.Cache.set(Row[Key], Group);
            } else {
                this.Cache.set(Row[Key], {[Idx]: Row});
            }
        }

        return this;
    }


    // ---------------------------------------------------------------- Utility methods

    /**
     * Iterates over this Selection's values and keys, and implements the new values returned from the callback.
     * @param {Function} Fn Callback function which determines the new values of the Selection.
     * @returns {Selection}
     */
    Map (Fn) {
        if (typeof Fn !== "function") return null;
        let i = 0;

        for (const [Key, Val] of this.Cache)
        this.Cache.set(Key, Fn(Val, Key, i++));

        return this;
    }

    /**
     * Creates a new memory allocation for the copy of this Selection.
     * @returns {Selection}
     */
    Clone () {
        const SelectionPairs = {...this.AsObject};
        return new Selection(SelectionPairs);
    }

}

module.exports = Selection;
