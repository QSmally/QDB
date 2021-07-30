
module.exports = connection => {
    const indexes = connection.indexes;
    const amount  = 1000 * 1000;

    const tStart = process.hrtime();

    for (let i = 0; i < amount; i++) {
        const id = indexes[Math.round(Math.random() * (indexes.length - 1))];
        connection.fetch(id);
    }

    return {
        tEnd: process.hrtime(tStart),
        amount
    };
}
