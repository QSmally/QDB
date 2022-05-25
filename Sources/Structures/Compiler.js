
class Compiler {

    static insertStatement = Symbol();
    static fetchStatement = Symbol();
    static countStatement = Symbol();
    static listKeysStatement = Symbol();
    static listStatement = Symbol();
    static batchListStatement = Symbol();

    cache = new Map();

    constructor(API, table) {
        this.API = API;
        this.table = table;
    }

    query(ofQueryKey) {
        const compiledQuery = this.cache.get(ofQueryKey);
        if (compiledQuery) return compiledQuery;

        const queryString = {
            [Compiler.insertStatement]:    `INSERT OR REPLACE INTO '${this.table}' ('Key', 'Val') VALUES (?, ?);`,
            [Compiler.fetchStatement]:     `SELECT Val FROM '${this.table}' WHERE Key = ?;`,
            [Compiler.countStatement]:     `SELECT COUNT(*) FROM '${this.table}';`,
            [Compiler.listKeysStatement]:  `SELECT Key FROM '${this.table}';`,
            [Compiler.listStatement]:      `SELECT Key, Val FROM '${this.table}';`,
            [Compiler.batchListStatement]: `SELECT Key, Val FROM '${this.table}' LIMIT ?,?;`
        }[ofQueryKey];

        const query = this.API.prepare(queryString);
        this.cache.set(ofQueryKey, query);
        return query;
    }
}

module.exports = Compiler;
