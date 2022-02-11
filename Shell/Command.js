
class Command {

    static name = null;
    static usage = null;
    static description = null;

    static examples = [];

    static arguments = 0;

    constructor(path, parameters) {
        this.path = path;
        this.parameters = parameters;
    }

    execute() {}
}

module.exports = Command;
