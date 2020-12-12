
module.exports = (QDB, Tap) => {

    const Con = new QDB.Connection("Test/Users.qdb");
    Con.API.prepare("DELETE FROM 'QDB';").run();

    // Base Connection functions
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

    // Lookup methods
    Tap("Con#Exist1", Con.Exists("1234"), false);
    Tap("Con#Exist2", Con.Exists("2345"), true);
    Tap("Con#Exist3", Con.Exists("6789"), false);
    Tap("Con#CacheSize9", Con.CacheSize, 2);

    Tap("Con#Find1", Con.Find((_e, i) => i.startsWith("34")), {Name: "roo", Age: 29});
    Tap("Con#CacheSize10", Con.CacheSize, 2);

    Tap("Con#Find2", Con.Find((_e, i) => i === "1289"), undefined);
    Tap("Con#CacheSize11", Con.CacheSize, 2);

    Tap("Con#Find3", Con.Find((_e, i) => i.startsWith("34")), {Name: "roo", Age: 29});
    Tap("Con#CacheSize12", Con.CacheSize, 2);

    Tap("Con#Evict3", Con.Evict().CacheSize, 0);

    Tap("Con#Set5", Con.Set("2345.Age", 30).Size, 3);
    Tap("Con#Fetch6", Con.Fetch("2345"), {Name: "bar", Age: 30, _DataStore: "2345"});

    // Array methods
    const IdxList = Con.Indexes;
    for (const Idx in IdxList)
    Tap(`Con#Set${parseInt(Idx) + 6}`, Con.Set(`${IdxList[Idx]}.Hobbies`, []).Size, 3);
    
    Tap("Con#Push1", Con.Push("3456", "wontWork"), null);
    Tap("Con#Push2", Con.Push("3456.Hobbies", "foo"), 1);
    Tap("Con#Push3", Con.Push("3456.Hobbies", "bar"), 2);
    Tap("Con#Push4", Con.Push("2345.Hobbies", "roo"), 1);

    Tap("Con#Pop1", Con.Pop("3456"), null);
    Tap("Con#Pop2", Con.Pop("3456.Hobbies"), "bar");
    Tap("Con#Pop3", Con.Fetch("3456.Hobbies.length"), 1);
    Tap("Con#Pop4", Con.Pop("3456.Hobbies"), "foo");
    Tap("Con#Pop5", Con.Fetch("3456.Hobbies.length"), 0);
    Tap("Con#Pop6", Con.Pop("3456.Hobbies"), undefined);
    Tap("Con#Pop7", Con.Fetch("3456.Hobbies.length"), 0);

    Tap("Con#Evict4", Con.Evict("3456").CacheSize, 2);

    Tap("Con#Push5", Con.Push("3456.Hobbies", "goo"), 1);
    Tap("Con#Push6", Con.Push("3456.Hobbies", "loo"), 2);

    Tap("Con#Remove1", Con.Remove("3456", F => F === "goo"), null);
    Tap("Con#Remove2", Con.Remove("3456.Hobbies", F => F === "foo"), 2);

    Tap("Con#Push6", Con.Push("3456.Hobbies", "1", "2", "3"), 5);

    Tap("Con#Shift1", Con.Shift("3456.Hobbies"), "goo");
    Tap("Con#Shift2", Con.Shift("3456.Hobbies", "-5"), 5);
    Tap("Con#Shift3", Con.Shift("3456.Hobbies", "one", "two", "three"), 8);

    Tap("Con#Set10", Con.Set("2345.Hobbies", ["one", "two", "three", "four"]).Fetch("2345.Hobbies.length"), 4);

    Tap("Con#Slice1", Con.Slice("3456.Hobbies"), 8);
    Tap("Con#Slice1", Con.Slice("3456.Hobbies", 1), 7);
    Tap("Con#Slice1", Con.Slice("3456.Hobbies", 0, 5), 5);

    // Utility methods
    Tap("Con#Ensure1", Con.Ensure("2345", {Name: "nope", Age: -1, Hobbies: []}), false);
    Tap("Con#Ensure2", Con.Ensure("6789", {Name: "Untitled", Age: -1, Hobbies: []}), true);

    const Tr = Con.Transaction();

    Tap("Con#Modify1", Con.Modify("6789.Name", Name => {
        Name = "moo";
        return Name;
    }), {Name: "moo", Age: -1, Hobbies: [], _DataStore: "6789"});

    Tap("Con#Modify2", Con.Modify("6789.Hobbies", Hob => {
        Hob.push({Programming: false});
        return Hob;
    }), {Name: "moo", Age: -1, Hobbies: [{Programming: false}], _DataStore: "6789"});

    Tap("Con#CacheSize13", Con.CacheSize, 4);

    Tr.Commit();
    
    Tap("Con#CacheSize14", Con.CacheSize, 4);
    Tap("Con#Fetch7", Con.Fetch("6789"), {Name: "moo", Age: -1, Hobbies: [{Programming: false}], _DataStore: "6789"});

    Tap("Con#Invert1", Con.Invert("6789.Hobbies.0.Programming"), true);
    Tap("Con#Invert2", Con.Invert("6789.Hobbies.0.Programming"), false);
    Tap("Con#Invert3", Con.Invert("6789.Hobbies.0.Programming"), true);
    Tap("Con#Invert4", Con.Invert("6789.Hobbies.0.Programming"), false);

    // Transaction tests
    const Tr2 = Con.Transaction();

    Tap("Con#Set11", Con.Set("foo", {bar: "roo!"}).Size, 5);
    Tap("Con#Fetch8", Con.Fetch("foo"), {bar: "roo!"});

    Tap("Con#Size15", Con.Size, 5);
    Tap("Con#CacheSize16", Con.CacheSize, 5);

    Tr2.Rollback();

    Tap("Con#Size17", Con.Size, 4);
    Tap("Con#CacheSize18", Con.CacheSize, 0);

    // Iterator methods
    let Results = [];

    Con.Each((_Row, Key) => {
        Results.push(Key);
    }, true);

    Tap("Con#Each", Results, ["4567", "3456", "2345", "6789"]);

    // Selection class
    Tap("Con#Select1", Con.Select((_Row, Key) => {
        return Key === "3456";
    }).Holds, "QDB");

    Tap("Con#Select2", Con.Select().Cache.size, 4);
    
    const Sel = Con.Select((_Row, Key) => Key.includes("4"));
    Tap("Con#Select3", Sel.Cache.size, 3);

    Tap("Sel#Keys", Sel.Keys, ["2345", "3456", "4567"]);

    Tap("Sel#Values", Sel.Values, [
        {Name: "bar", Age: 30, Hobbies: ["one", "two", "three", "four"]},
        {Name: "roo", Age: 29, Hobbies: ["one", "two", "three", "-5", "loo", "1", "2", "3"]},
        {Name: "goo", Age: 27, Hobbies: []}
    ]);

    Tap("Sel#AsObject", Sel.AsObject, {
        "2345": {Name: "bar", Age: 30, Hobbies: ["one", "two", "three", "four"]},
        "3456": {Name: "roo", Age: 29, Hobbies: ["one", "two", "three", "-5", "loo", "1", "2", "3"]},
        "4567": {Name: "goo", Age: 27, Hobbies: []}
    });

    const Sel4 = Sel.Clone();

    Tap("Sel#Order", Sel.Order((a, b) => a.Age - b.Age).Keys, ["4567", "3456", "2345"]);
    Tap("Sel#Filter", Sel.Filter((_Row, Key) => Key !== "3456").Cache.size, 2);

    Tap("Sel#Limit1", Sel.Limit(0, 3).Cache.size, 2);
    Tap("Sel#Limit2", Sel.Limit(1, 5).Cache.size, 1);
    Tap("Sel#Limit3", Sel.Limit(1).Cache.size, 0);

    const Sel2 = Con.Select();
    Tap("Sel#Select4", Sel2.Cache.size, 4);
    
    Sel2.Map((Val, Key) => {
        Val = {...Val};
        Val.foo = Key === "3456" ? "bar" : "roo";
        return Val;
    });

    Tap("Sel#Map1", Sel2.Cache.get("2345").foo, "roo");
    Tap("Sel#Map2", Sel2.Cache.get("3456").foo, "bar");
    Tap("Sel#Map3", Sel2.Cache.get("4567").foo, "roo");
    Tap("Sel#Map4", Sel2.Cache.get("6789").foo, "roo");

    Sel2.Group("foo");

    Tap("Sel#Group1", Object.keys(Sel2.Cache.get("bar")).length, 1);
    Tap("Sel#Group2", Object.keys(Sel2.Cache.get("roo")).length, 3);

    const Sel3 = Sel2.Clone();
    Sel3.Cache.set("boo", {Name: "boo", Age: 23, Hobbies: ["slep"]});

    Tap("Sel#Clone1", Sel3.Cache.size, 3);
    Tap("Sel#Clone2", Sel2.Cache.size, 2);

    // Object reference tests
    const Selection = require("../lib/Utility/Selection");
    const Projects = new Selection({
        fooProj: {UserId: "4567", Does: ["nothing", "foo"]},
        barProj: {UserId: "2345", Does: ["sleep"]},
        rooProj: {UserId: "4567", Does: ["mind read"]},
    }, "Projects");

    const CopySel4 = Sel4.Clone();
    Sel4.Join(Projects.Clone(), "UserId");

    Tap("Sel#Join1", Sel4.Cache.get("4567").Projects.fooProj.Does, ["nothing", "foo"]);
    Tap("Sel#Join2", Sel4.Cache.get("2345").Projects.barProj.Does, ["sleep"]);
    Tap("Sel#Join3", Sel4.Cache.get("4567").Projects.rooProj.Does, ["mind read"]);

    const CopyCloneSel4 = CopySel4.Clone();
    CopySel4.Join(Projects.Clone(), "UserId", "Customs");

    Tap("Sel#Join4", CopySel4.Cache.get("4567").Customs.fooProj.Does, ["nothing", "foo"]);
    Tap("Sel#Join5", CopySel4.Cache.get("2345").Customs.barProj.Does, ["sleep"]);
    Tap("Sel#Join6", CopySel4.Cache.get("4567").Customs.rooProj.Does, ["mind read"]);

    CopyCloneSel4.Join(Projects.Clone(), "UserId", false);

    Tap("Sel#Join7", CopyCloneSel4.Cache.get("4567").fooProj.Does, ["nothing", "foo"]);
    Tap("Sel#Join8", CopyCloneSel4.Cache.get("2345").barProj.Does, ["sleep"]);
    Tap("Sel#Join9", CopyCloneSel4.Cache.get("4567").rooProj.Does, ["mind read"]);

    Sel.Merge(Sel3, Sel4);

    Tap("Sel#Merge1", Sel.Cache.size, 6);
    Tap("Sel#Merge2", Sel3.Cache.size, 3);
    Tap("Sel#Merge3", Sel4.Cache.size, 3);

    Tap("Sel#Merge4", Sel.Keys, [
        "roo", "bar", "boo",
        "2345", "3456", "4567"
    ]);

    Con.Disconnect();

}
