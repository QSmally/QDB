
module.exports = connection => {
    const tStart = process.hrtime();

    const selection = connection.select(user => {
        return user.username === "Amy";
    });

    return {
        tEnd: process.hrtime(tStart),
        amount: selection.cache.size
    };
}
