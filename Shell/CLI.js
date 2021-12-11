#!/usr/bin/env node
"use strict";

const Formatter = require("./Formatter");

const { existsSync, readdirSync } = require("fs");

class CLIStateController {

    static parameters = process.argv.slice(2);

    static commands = new Map(readdirSync(`${__dirname}/Commands/`)
        .map(file => require(`./Commands/${file}`))
        .map(Command => [Command.name, Command])
    );

    constructor() {
        CLIStateController.parameters.length ?
            this.handleCommand(CLIStateController.parameters.shift()) :
            new (CLIStateController.commands.get("help"))().execute();
    }

    static newline = console.log;

    handleCommand(actionOrFile) {
        const Executable = CLIStateController.commands.get(actionOrFile.toLowerCase());
        if (Executable) return new Executable(CLIStateController.parameters.shift()).execute();

        if (existsSync(actionOrFile)) {
            return this.handleConnectionCommand(actionOrFile);
        }

        CLIStateController.newline([
            `${Formatter.dim("Error")}: '${actionOrFile}' does not exist.`,
            "Use 'qdb make <database>' to create a new database file."
        ].join("\n"));
    }

    handleConnectionCommand(database) {
        const commands = new Map(readdirSync(`${__dirname}/Connection/`)
            .map(file => [file.split(".").shift().toLowerCase(), require(`./Connection/${file}`)])
        );

        const target = CLIStateController.parameters.shift() ?? "list";
        const Command = commands.get(target.toLowerCase());
    
        if (Command) {
            if (Command.arguments > CLIStateController.parameters.length)
                return CLIStateController.newline(`${Format.dim("Error")}: expected ${Command.arguments} arguments, but received ${CLIStateController.parameters.length}.`);
    
            try {
                return new Command(database, CLIStateController.parameters).execute();
            } catch (error) {
                const message = `${Formatter.dim("Error")}: ${error.message.toLowerCase()}`;
                return CLIStateController.newline(message);
            }
        }

        CLIStateController.newline([
            `${Formatter.dim("Error")}: database command '${target}' does not exist.`,
            "See a list of commands by invoking 'qdb help [command]'."
        ].join("\n"));
    }
}

new CLIStateController();
