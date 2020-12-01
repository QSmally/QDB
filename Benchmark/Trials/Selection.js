
module.exports = Connection => {
    const Selection = Connection.Select(User => User.Username === "Amy");
    return Selection.Cache.size;
}
