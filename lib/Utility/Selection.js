
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

    }

    /**
     * Sweeps values that satisfy the provided function.
     * Identical to the `FILTER BY` SQL statement.
     * @param {Function} Fn Function that determines which entries to sweep.
     * @returns {Selection}
     */
    Filter (Fn) {

    }

    /**
     * Slices off values from this Selection.
     * Identical to the `LIMIT begin, end` SQL statement.
     * @param {Number} Begin Integer to indicate the beginning to slice.
     * @param {Number} End Integer to indicate the end of the slice.
     * @returns {Selection}
     */
    Limit (Begin, End) {

    }

}

module.exports = Selection;
