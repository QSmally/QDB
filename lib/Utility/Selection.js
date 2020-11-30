
"use strict";

const {Collection} = require("qulity");

class Selection {

    /**
     * An unchanged piece of the database in memory, to use
     * as baseline of various endpoints to execute functions with.
     * @param {Object} _Entries Initial selection of entries for this Selection instance.
     * @param {String} _Holds Reference to the table this Selection will hold.
     * @example const Selection = MyDB.Select(User => User.Age > 20);
     */
    constructor (_Entries, _Holds) {
        
        /**
         * Cached dataset instances of this Selection.
         * @name Selection#Cache
         * @type {Collection}
         * @link https://github.com/QSmally/Qulity/blob/master/Documentation/Collection.md
         * @readonly
         */
        Object.defineProperty(this, "Cache", {
            enumerable: true,
            value: new Collection()
        });

        for (const Id in _Entries)
        this.Cache.set(Id, _Entries[Id]);

        /**
         * Reference to the table this Selection holds.
         * @name Selection#Holds
         * @type {String}
         * @readonly
         */
        Object.defineProperty(this, "Holds", {
            enumerable: true,
            value: _Holds
        });

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
        return this.Cache.toObject();
    }


    Retrieve (Key) {
        if (!Key) return null;
        return this.Cache.get(Key);
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
            if (!Fn(Val, Key, this)) this.Cache.delete(Key);
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
            this.Cache.delete(Key[0]);
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
        const Original = this.Cache.toObject();
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

    /**
     * Joins another Selection into this instance based on a referrer field.
     * Identical to the `FULL JOIN` SQL statement.
     * @param {Selection} Secondary Another Selection instance to join into this one.
     * @param {String} Field Which field to check for a reference to this Selection's rows.
     * @param {Boolean|String} [Property] Boolean false to flatten the entries into this Selection's rows,
     * a string value that implicitly indicates the property to add the merging entries,
     * or a boolean true to use the Selection's table name as property.
     * @returns {Selection}
     */
    Join (Secondary, Field, Property = true) {
        if (!(Secondary instanceof Selection)) return null;
        if (typeof Field !== "string")         return null;

        const Key = typeof Property === "string" ? Property : Secondary.Holds;
        if (Property) this.Map(Entry => { Entry[Key] = {}; return Entry; });

        for (const [Id, Val] of Secondary.Cache) {
            const FieldId = Val[Field];
            let Origin = this.Cache.get(FieldId);
            if (!Origin) continue;

            if (!Property) Origin[Id] = Val;
            else Origin[Key][Id] = Val;
            this.Cache.set(FieldId, Origin);
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
     * Automatically clones the merging Selections and adds them into this instance.
     * @param {...Selection} Selections Instances to clone and merge into this one.
     * @returns {Selection}
     */
    Merge (...Selections) {
        if (!(Selections instanceof Array)) return null;

        for (const Sel of Selections.map(Sel => Sel.Clone()))
        for (const [Key, Val] of Sel.Cache)
        this.Cache.set(Key, Val);

        return this;
    }

    /**
     * Creates a new memory allocation for the copy of this Selection.
     * @param {String} [Holds] Optional new identifier value for the cloned Selection.
     * @returns {Selection}
     */
    Clone (Holds = undefined) {
        const {serialize, deserialize} = require("v8");
        const SelectionPairs = deserialize(serialize(this.AsObject));
        return new Selection(SelectionPairs, Holds || this.Holds);
    }

}

module.exports = Selection;
