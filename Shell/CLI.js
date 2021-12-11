#!/usr/bin/env node
"use strict";

const Formatter = require("./Formatter");

const { existsSync, readdirSync } = require("fs");

class CLIStateController {

    static parameters = process.argv.slice(2);

    static commands = new Map(readdirSync(`${__dirname}/Commands/`)
        .map(file => [file.split(".").shift().toLowerCase(), require(`./Commands/${file}`)])
    );

    constructor() {
        CLIStateController.parameters.length ?
            this.handleCommand(CLIStateController.parameters.shift()) :
            CLIStateController.commands.get("help")();
    }

    static newline = console.log;

    handleCommand(actionOrFile) {
        const executable = CLIStateController.commands.get(actionOrFile.toLowerCase());
        if (executable) return executable(CLIStateController.parameters.shift());

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
        const command = commands.get(target.toLowerCase());
    
        if (command) {
            if (CLIStateController.parameters.length !== command.arguments)
                return CLIStateController.newline(`${Format.dim("Error")}: expected ${command.arguments} arguments, but received ${CLIStateController.parameters.length}.`);
    
            try {
                return command.execute(database, CLIStateController.parameters);
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
