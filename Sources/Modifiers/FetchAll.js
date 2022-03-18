
const Modifier = require("../Structures/Modifier");

class FetchAllModifier extends Modifier {

    get enabled() {
        const { fetchAll: batchSize } = this.connection.configuration;
        return batchSize > 0;
    }

    execute() {
        const { fetchAll: batchSize } = this.connection.configuration;
        const maxSize = this.connection.cacheController.maxSize ?? Infinity;
        const batchAmount = Math.ceil(Math.min(this.connection.size, maxSize) / batchSize);

        for (let batch = 0;
            batch < batchAmount;
            batch++) this.batch(batch, batchSize);
    }

    batch(batch, batchSize) {
        setImmediate(() => {
            this.connection.API
                .prepare(`SELECT Key, Val FROM '${this.connection.table}' LIMIT ?,?;`)
                .all(batch * batchSize, batchSize)
                .forEach(entry => this.patch(entry));
        });
    }

    patch({ Key: keyContext, Val: document }) {
        this.connection.cacheController
            .patch(keyContext, JSON.parse(document));
    }
}

module.exports = FetchAllModifier;
