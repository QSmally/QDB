
module.exports = Connection => {
    const Indexes = Connection.Indexes;
    const Pattern = 3;

    for (let i = 0; i < Indexes.length; i++) {
        if (i % Pattern !== 0) continue;
        Connection.Fetch(Indexes[i]);
    }

    const Target = Connection.Fetch(Indexes[Indexes.length - 1]);
    const TStart = process.hrtime();

    Connection.Find(({Username, Password}) => Username === Target.Username && Password === Target.Password);

    return {
        TEnd: process.hrtime(TStart),
        Amount: Connection.CacheSize
    };
}
