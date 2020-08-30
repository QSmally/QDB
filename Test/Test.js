
module.exports = (QDB, Tap) => {

    const Con = new QDB.Connection("Test/Users.qdb");
    Con.API.prepare("DELETE FROM 'QDB'").run();

    try {
        if (Con.Set()) throw "Set";
        if (Con.Fetch()) throw "Fetch";
        // Evict - Should evict all, not a bug
        // Erase - Always returns the Connection
        if (Con.Exists()) throw "Exists";
        if (Con.Find()) throw "Find";
        if (Con.Accumulate()) throw "Accumulate";
        if (Con.Each()) throw "Each";
        if (Con.Select()) throw "Select";
        if (Con.Push()) throw "Push";
        if (Con.Shift()) throw "Shift";
        if (Con.Pop()) throw "Pop";
        if (Con.Remove()) throw "Remove";
        if (Con.Ensure()) throw "Ensure";
        if (Con.Modify()) throw "Modify";
        if (Con.Invert()) throw "Invert";
    } catch (e) {
        console.log(e);
        return Con.Disconnect();
    }

    Tap("Con#Set1", Con.Set("1234", {Name: "foo", Age: 26}).Size, 1);
    Tap("Con#CacheSize1", Con.CacheSize, 0);
    Tap("Con#Set2", Con.Set("2345", {Name: "bar", Age: 21}).Size, 2);
    Tap("Con#CacheSize2", Con.CacheSize, 0);
    Tap("Con#Size1", Con.Size, 2);

    Tap("Con#Fetch1", Con.Fetch("2345"), {Name: "bar", Age: 21});
    Tap("Con#CacheSize3", Con.CacheSize, 1);
    Tap("Con#Size2", Con.Size, 2);

    Tap("Con#Fetch2", Con.Fetch("1234"), {Name: "foo", Age: 26});
    Tap("Con#CacheSize4", Con.CacheSize, 2);
    Tap("Con#Size3", Con.Size, 2);

    Tap("Con#Fetch3", Con.Fetch("2345"), {Name: "bar", Age: 21, _DataStore: "2345"});
    Tap("Con#CacheSize5", Con.CacheSize, 2);
    Tap("Con#Size4", Con.Size, 2);

    Tap("Con#Evict1", Con.Evict("2345").CacheSize, 1);

    Tap("Con#Set3", Con.Set("3456", {Name: "roo", Age: 29}).Size, 3);
    Tap("Con#CacheSize6", Con.CacheSize, 1);
    Tap("Con#Set4", Con.Set("4567", {Name: "goo", Age: 27}).Size, 4);
    Tap("Con#CacheSize7", Con.CacheSize, 1);
    Tap("Con#Size5", Con.Size, 4);

    Tap("Con#Fetch4", Con.Fetch("3456"), {Name: "roo", Age: 29});
    Tap("Con#Fetch5", Con.Fetch("2345"), {Name: "bar", Age: 21});
    Tap("Con#Fetch6", Con.Fetch("1234"), {Name: "foo", Age: 26, _DataStore: "1234"});
    Tap("Con#Fetch5", Con.Fetch("4567"), {Name: "goo", Age: 27});
    Tap("Con#Evict2", Con.Evict("2345", "3456").CacheSize, 2);

    Tap("Con#Erase1", Con.Erase("1234").Size, 3);
    Tap("Con#CacheSize8", Con.CacheSize, 1);

    Tap("Con#Exist1", Con.Exists("1234"), false);
    Tap("Con#Exist2", Con.Exists("2345"), true);
    Tap("Con#Exist3", Con.Exists("6789"), false);
    Tap("Con#CacheSize9", Con.CacheSize, 2);

    Tap("Con#Find1", Con.Find(e => e.startsWith("34")), {Name: "roo", Age: 29});
    Tap("Con#CacheSize10", Con.CacheSize, 3);

    Tap("Con#Find2", Con.Find(e => e === "1289"), undefined);
    Tap("Con#CacheSize11", Con.CacheSize, 3);

    Tap("Con#Find3", Con.Find(e => e.startsWith("34")), {Name: "roo", Age: 29, _DataStore: "3456"});
    Tap("Con#CacheSize12", Con.CacheSize, 3);

    Tap("Con#Evict3", Con.Evict().CacheSize, 0);

    Tap("Con#Set5", Con.Set("2345.Age", 30).Size, 3);
    Tap("Con#Fetch6", Con.Fetch("2345"), {Name: "bar", Age: 30, _DataStore: "2345"});

    const IdxList = Con.Indexes;
    for (const Idx in IdxList)
    Tap(`Con#Set${parseInt(Idx) + 6}`, Con.Set(`${IdxList[Idx]}.Hobbies`, []).Size, 3);
    
    Tap("Con#Push1", Con.Push("3456", "wontWork"), null);
    Tap("Con#Push2", Con.Push("3456.Hobbies", "foo").Fetch("3456.Hobbies.length"), 1);
    Tap("Con#Push3", Con.Push("3456.Hobbies", "bar").Fetch("3456.Hobbies.length"), 2);
    Tap("Con#Push4", Con.Push("2345.Hobbies", "roo").Fetch("2345.Hobbies.length"), 1);

    Tap("Con#Pop1", Con.Pop("3456"), null);
    Con.Pop("3456.Hobbies");
    Tap("Con#Pop2", Con.Fetch("3456.Hobbies.length"), 1);
    Con.Pop("3456.Hobbies");
    Tap("Con#Pop3", Con.Fetch("3456.Hobbies.length"), 0);
    Con.Pop("3456.Hobbies");
    Tap("Con#Pop4", Con.Fetch("3456.Hobbies.length"), 0);

    Tap("Con#Evict4", Con.Evict("3456").CacheSize, 2);

    Tap("Con#Push5", Con.Push("3456.Hobbies", "goo").Fetch("3456.Hobbies.length"), 1);
    Tap("Con#Push6", Con.Push("3456.Hobbies", "loo").Fetch("3456.Hobbies.length"), 2);

    Tap("Con#Remove1", Con.Remove("3456", F => F === "goo"), null);
    Tap("Con#Remove2", Con.Remove("3456.Hobbies", F => F === "foo").Fetch("3456.Hobbies.length"), 2);

    Tap("Con#Push6", Con.Push("3456.Hobbies", "1", "2", "3").Fetch("3456.Hobbies.length"), 5);

    Tap("Con#Shift1", Con.Shift("3456.Hobbies"), "goo");
    Tap("Con#Shift2", Con.Shift("3456.Hobbies", "-5"), 5);
    Tap("Con#Shift3", Con.Shift("3456.Hobbies", "one", "two", "three"), 8);

    Tap("Con#Set10", Con.Set("2345.Hobbies", ["one", "two", "three", "four"]).Fetch("2345.Hobbies.length"), 4);

    Tap("Con#Ensure1", Con.Ensure("2345", {Name: "nope", Age: -1, Hobbies: []}), false);
    Tap("Con#Ensure2", Con.Ensure("6789", {Name: "Untitled", Age: -1, Hobbies: []}), true);

    Tap("Con#Modify1", Con.Modify("6789.Name", Name => {
        Name = "moo";
        return Name;
    }), {Name: "moo", Age: -1, Hobbies: [], _DataStore: "6789"});

    Tap("Con#Modify2", Con.Modify("6789.Hobbies", Hob => {
        Hob.push({Programming: false});
        return Hob;
    }), {Name: "moo", Age: -1, Hobbies: [{Programming: false}], _DataStore: "6789"});

    Tap("Con#Invert1", Con.Invert("6789.Hobbies.0.Programming"), true);
    Tap("Con#Invert2", Con.Invert("6789.Hobbies.0.Programming"), false);
    Tap("Con#Invert3", Con.Invert("6789.Hobbies.0.Programming"), true);
    Tap("Con#Invert4", Con.Invert("6789.Hobbies.0.Programming"), false);

    let res = [];

    Con.Each((_Row, Key) => {
        res.push(Key);
    }, true);

    Tap("Con#Each", res, [...Con.Indexes]);

    Tap("Con#Select", Con.Select((_Row, Key) => {
        return Key === "3456";
    }), {
        "3456": {
            Name: "roo",
            Age: 29,
            Hobbies: [
                "one",   "two",
                "three", "-5",
                "loo",   "1",
                "2",     "3"
            ],
            _DataStore: "3456"
        }
    });

    Con.Disconnect();

}
