
const Modifier = require("../Structures/Modifier");

class MigrationModifier extends Modifier {

    get enabled() {
        const { model, migrate } = this.connection.configuration;
        return model && migrate;
    }

    get dataSchema() {
        return this.connection.configuration.dataSchema;
    }

    execute() {
        const transaction = this.connection.transaction();
        this.connection.each((entity, key) => this.connection.set(key, this.dataSchema.instance(entity)));
        transaction.commit();
    }
}

module.exports = MigrationModifier;
