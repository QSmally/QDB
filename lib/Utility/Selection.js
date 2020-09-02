
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

}

module.exports = Selection;
