
class Modifier {
    
    /**
     * A modifier instance which is instantiated at the start of the Connection
     * class.
     * @param {Connection} connection A target database instance.
     */
    constructor(connection) {
        /**
         * A Connection to target with this Modifier.
         * @name Modifier#connection
         * @type {Connection}
         */
        this.connection = connection;

        if (this.enabled) {
            setImmediate(() => this.execute());
        }
    }

    /**
     * A condition to pass in order to execute the Modifier's execution method,
     * like a configuration option or some sort of unique precondition such as
     * table size.
     * @name Modifier#enabled
     * @type {Boolean}
     * @abstract
     */
    get enabled() {
        return true;
    }

    /**
     * The Modifier's implementation.
     * @abstract
     */
    execute() {}
}

module.exports = Modifier;
