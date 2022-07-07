
class Compiler {

    static statements = {
        insert: Symbol(),
        fetch: Symbol(),
        count: Symbol(),
        listKeys: Symbol(),
        list: Symbol(),
        batchList: Symbol() };

    cache = new Map();

    constructor(API, table) {
        this.API = API;
        this.table = table;
    }

    query(ofQueryKey) {
        const compiledQuery = this.cache.get(ofQueryKey);
        if (compiledQuery) return compiledQuery;

        const queryString = {
            [Compiler.statements.insert]:    `INSERT OR REPLACE INTO '${this.table}' ('Key', 'Val') VALUES (?, ?);`,
            [Compiler.statements.fetch]:     `SELECT Val FROM '${this.table}' WHERE Key = ?;`,
            [Compiler.statements.count]:     `SELECT COUNT(*) FROM '${this.table}';`,
            [Compiler.statements.listKeys]:  `SELECT Key FROM '${this.table}';`,
            [Compiler.statements.list]:      `SELECT Key, Val FROM '${this.table}';`,
            [Compiler.statements.batchList]: `SELECT Key, Val FROM '${this.table}' LIMIT ?,?;`
        }[ofQueryKey];

        const query = this.API.prepare(queryString);
        this.cache.set(ofQueryKey, query);
        return query;
    }
}

module.exports = Compiler;
