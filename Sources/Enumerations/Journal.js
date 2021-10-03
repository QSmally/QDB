
/**
 * @enum {String}
 * @property {String} delete
 * @property {String} truncate
 * @property {String} persist
 * @property {String} memory
 * @property {String} logAhead
 * @property {String} none
 */
class Journal {
    static delete = "delete";
    static truncate = "truncate";
    static persist = "persist";
    static memory = "memory";
    static logAhead = "wal";
    static none = "off";
}

module.exports = Journal;
