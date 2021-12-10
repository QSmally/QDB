
const Modifier = require("../Structures/Modifier");
const Schema   = require("../Implementations/Schema");

class MigrationModifier extends Modifier {

    get enabled() {
        const { model, migrate } = this.connection.configuration;
        this.model = typeof model === "string" ?
            Schema.models.get(model) :
            model;
        return this.model && migrate;
    }

    execute() {
        const transaction = this.connection.transaction();
        this.connection.each((entity, key) => this.connection.set(key, this.model.instance(entity)));
        transaction.commit();
    }
}

module.exports = MigrationModifier;
