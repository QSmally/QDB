
"use strict";

const Connection = require("../Connections/Connection");
const {Manager}  = require("qulity");

class Selection extends Manager {

    /**
     * An unchanged piece of the database in memory, to use
     * as baseline of various endpoints to execute functions with.
     * @param {Object} _Entries Initial selection of entries for this Selection instance.
     * @example const Selection = MyDB.Select(User => User.Age > 20);
     * @extends {Manager}
     * @link https://github.com/QSmally/Qulity/blob/master/Documentation/Manager.md
     */
    constructor (_Entries) {
        super(_Entries, Connection);
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
     * Serialises this Selection into an array.
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


    /**
     * Sorts this Selection's value.
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
     * Sweeps values that satisfy the provided function.
     * Identical to the `FILTER BY` SQL statement, but inverted.
     * @param {Function} Fn Function that determines which entries to sweep.
     * @returns {Selection}
     */
    Filter (Fn) {
        if (typeof Fn === "function") {
            Fn.bind(this);
            for (const [Key, Val] of this.Cache)
            if (!Fn(Val, Key, this)) this.remove(Key);
        }

        return this;
    }

    /**
     * Slices off values from this Selection.
     * Identical to the `LIMIT begin, end` SQL statement.
     * @param {Number} Begin Integer to indicate the beginning to slice.
     * @param {Number} [End] Integer to indicate the end of the slice.
     * @returns {Selection}
     */
    Limit (Begin, End = undefined) {
        if (typeof Begin !== "number") return this;
        if (End && typeof End !== "number") return this;
        if (!End) End = this.Cache.size;

        let i = 0;

        for (const Key of this.Cache) {
            console.log(i, Key);
            if (i < Begin || i >= End)
            this.remove(Key[0]);
            i++;
        }

        return this;
    }

}

module.exports = Selection;
