
class Compiler {

    insertStatement = null;
    fetchStatement = null;
    listStatement = null;

    constructor(API, table) {
        this.API = API;
        this.table = table;
    }

    get insert() {
        if (this.insertStatement) return this.insertStatement;
        this.insertStatement = this.API.prepare(`INSERT OR REPLACE INTO '${this.table}' ('Key', 'Val') VALUES (?, ?);`);
        return this.insertStatement;
    }

    get fetch() {
        if (this.fetchStatement) return this.fetchStatement;
        this.fetchStatement = this.API.prepare(`SELECT Val FROM '${this.table}' WHERE Key = ?;`);
        return this.fetchStatement;
    }

    get list() {
        if (this.listStatement) return this.listStatement;
        this.listStatement = this.API.prepare(`SELECT Key, Val FROM '${this.table}';`);
        return this.listStatement;
    }
}

module.exports = Compiler;
