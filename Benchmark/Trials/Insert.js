
const Crypto = require("crypto");

module.exports = Connection => {
    const Amount  = 1000;

    for (let i = 0; i < Amount; i++) {
        const Id = Crypto.randomBytes(8).toString("hex");
        Connection.Set(Id, {Test: "Insertion"});
    }

    return Amount;
}
