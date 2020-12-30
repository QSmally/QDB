
module.exports = Connection => {
    const TStart = process.hrtime();

    const Selection = Connection.Select(User => User.Username === "Amy");

    return {
        TEnd: process.hrtime(TStart),
        Amount: Selection.Cache.size
    };
}
