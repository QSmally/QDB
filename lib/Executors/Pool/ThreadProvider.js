
"use strict";

class ThreadProvider {

    /**
     * A gateway provider to communicate to the Connection
     * this ThreadProvider holds as a separate worker.
     * @param {Pathlike} PathURL Path to the main database this ThreadProvider manages.
     * @param {RawOptions} Options Validated options for this ThreadProvider's Connection.
     * @param {Pool} Pool The Pool reference this ThreadProvider was initialised with.
     */
    constructor (PathURL, Options, Pool) {

    }

}

module.exports = ThreadProvider;
