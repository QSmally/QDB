
module.exports = Connection => {
    const Indexes = Connection.Indexes;
    const Amount  = 1000 * 1000;

    for (let i = 0; i < Amount; i++) {
        const Id = Indexes[Math.round(Math.random() * Indexes.length - 1)];
        Connection.Fetch(Id);
    }

    return Amount;
}
