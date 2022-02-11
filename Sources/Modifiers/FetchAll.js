
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
                .prepare(`SELECT Key, Val FROM '${this.connection.table}' LIMIT ${batch * batchSize},${batchSize};`)
                .all()
                .forEach(entry => this.patch(entry));
        });
    }

    patch(entry) {
        this.connection.cacheController
            .patch(entry["Key"], JSON.parse(entry["Val"]));
    }
}

module.exports = FetchAllModifier;
