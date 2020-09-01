
"use strict";

const {Manager} = require("qulity");

class Selection extends Manager {

    /**
     * An unchanged piece of the database in memory, to use
     * as baseline of various endpoints to execute functions with.
     * @param {Object} Entries Initial selection of entries for this Selection instance.
     * @example const Selection = QDB.Select(User => User.Age > 20);
     * @extends {Manager}
     */
    constructor (Entries) {

        super(Entries, Selection);

    }

}

module.exports = Selection;
