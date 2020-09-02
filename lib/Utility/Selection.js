
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
     * Serialises this Selection into an array.
     * @name Selection#Values
     * @type {Object}
     */
    get Values () {
        return this.Cache.toArray();
    }

}

module.exports = Selection;
