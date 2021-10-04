
class Journal {
    static delete = "delete";
    static truncate = "truncate";
    static persist = "persist";
    static memory = "memory";
    static writeAhead = "wal";
    static none = "off";
}

module.exports = Journal;
