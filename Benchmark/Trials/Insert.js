
const Crypto = require("crypto");

module.exports = connection => {
    const tStart = process.hrtime();
    const amount = 1000;

    for (let i = 0; i < amount; i++) {
        const id = Crypto.randomBytes(8).toString("hex");
        connection.set(id, { test: "Insertion" });
    }

    return {
        tEnd: process.hrtime(tStart),
        amount
    };
}
