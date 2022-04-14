
const Schema   = require("../Schema");
const Modifier = require("../Structures/Modifier");

class MigrationModifier extends Modifier {

    get enabled() {
        const { model, migrate } = this.connection.configuration;
        this.model = Schema.castType(model);
        return this.model && migrate;
    }

    execute() {
        const transaction = this.connection.transaction();
        this.connection.each((entity, key) => this.connection.set(key, this.model.instance(entity)));
        transaction.commit();
    }
}

module.exports = MigrationModifier;
