
const Crypto = require("crypto");

module.exports = Connection => {
    const Amount  = 1000;

    const TStart = process.hrtime();

    for (let i = 0; i < Amount; i++) {
        const Id = Crypto.randomBytes(8).toString("hex");
        Connection.Set(Id, {Test: "Insertion"});
    }

    return {
        TEnd: process.hrtime(TStart),
        Amount
    };
}
