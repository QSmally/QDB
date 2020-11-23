
const CLI = require("cli-color");

process.stdout.write(CLI.reset);
process.stdout.write(CLI.cyan("Generating tables for benchmark...\n"));
const Trials = require("./Seed")();

// process.stdout.write(CLI.reset);
// process.stdout.write(CLI.cyan.bold("Running benchmarks...\n"));

// for (const Trial of Trials) {

// }
