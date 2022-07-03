
module.exports = connection => {
    const indexes = connection.indexes;
    const pattern = 3;

    for (let i = 0; i < indexes.length; i++) {
        if (i % pattern === 0)
            connection.fetch(indexes[i]);
    }

    const target = connection.fetch(indexes[indexes.length - 1]);
    const tStart = process.hrtime();

    connection.find(({ username, password }) => {
        return username === target.username && password === target.password;
    });

    return {
        tEnd: process.hrtime(tStart),
        amount: connection.cacheSize
    };
}
