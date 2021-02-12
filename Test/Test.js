
module.exports = (QDB, Tap) => {

    const Con = new QDB.Connection("Test/Users.qdb");
    Con.API.prepare("DELETE FROM 'QDB';").run();

    Tap("Connection", Con.State, "CONNECTED");

    // Base Connection functions
    Tap("Connection Set 1", Con.Set("1234", {Name: "foo", Age: 26}).Size, 1);
    Tap("Connection CacheSize 1", Con.CacheSize, 0);
    Tap("Connection Set 2", Con.Set("2345", {Name: "bar", Age: 21}).Size, 2);
    Tap("Connection CacheSize 2", Con.CacheSize, 0);
    Tap("Connection Size 1", Con.Size, 2);

    Tap("Connection Fetch 1", Con.Fetch("2345"), {Name: "bar", Age: 21});
    Tap("Connection CacheSize 3", Con.CacheSize, 1);
    Tap("Connection Size 2", Con.Size, 2);

    Tap("Connection Fetch 2", Con.Fetch("1234"), {Name: "foo", Age: 26});
    Tap("Connection CacheSize 4", Con.CacheSize, 2);
    Tap("Connection Size 3", Con.Size, 2);

    Tap("Connection Fetch 3", Con.Fetch("2345"), {Name: "bar", Age: 21});
    Tap("Connection CacheSize 5", Con.CacheSize, 2);
    Tap("Connection Size 4", Con.Size, 2);

    Tap("Connection Evict 1", Con.Evict("2345").CacheSize, 1);

    Tap("Connection Set 3", Con.Set("3456", {Name: "roo", Age: 29}).Size, 3);
    Tap("Connection CacheSize 6", Con.CacheSize, 1);
    Tap("Connection Set 4", Con.Set("4567", {Name: "goo", Age: 27}).Size, 4);
    Tap("Connection CacheSize 7", Con.CacheSize, 1);
    Tap("Connection Size 5", Con.Size, 4);

    Tap("Connection Fetch 4", Con.Fetch("3456"), {Name: "roo", Age: 29});
    Tap("Connection Fetch 5", Con.Fetch("2345"), {Name: "bar", Age: 21});
    Tap("Connection Fetch 6", Con.Fetch("1234"), {Name: "foo", Age: 26});
    Tap("Connection Fetch 5", Con.Fetch("4567"), {Name: "goo", Age: 27});
    Tap("Connection Evict 2", Con.Evict("2345", "3456").CacheSize, 2);

    Tap("Connection Erase 1", Con.Erase("1234").Size, 3);
    Tap("Connection CacheSize 8", Con.CacheSize, 1);

    // Lookup methods
    Tap("Connection Exist 1", Con.Exists("1234"), false);
    Tap("Connection Exist 2", Con.Exists("2345"), true);
    Tap("Connection Exist 3", Con.Exists("6789"), false);
    Tap("Connection CacheSize 9", Con.CacheSize, 2);

    Tap("Connection Find 1", Con.Find((_e, i) => i.startsWith("34")), {Name: "roo", Age: 29});
    Tap("Connection CacheSize 10", Con.CacheSize, 2);

    Tap("Connection Find 2", Con.Find((_e, i) => i === "1289"), undefined);
    Tap("Connection CacheSize 11", Con.CacheSize, 2);

    Tap("Connection Find 3", Con.Find((_e, i) => i.startsWith("34")), {Name: "roo", Age: 29});
    Tap("Connection CacheSize 12", Con.CacheSize, 2);

    Tap("Connection Evict 3", Con.Evict().CacheSize, 0);

    Tap("Connection Set 5", Con.Set("2345.Age", 30).Size, 3);
    Tap("Connection Fetch 6", Con.Fetch("2345"), {Name: "bar", Age: 30});

    // Array methods
    const IdxList = Con.Indexes;
    for (const Idx in IdxList)
    Tap(`Connection Set ${parseInt(Idx) + 6}`, Con.Set(`${IdxList[Idx]}.Hobbies`, []).Size, 3);
    
    Tap("Connection Push 1", Con.Push("3456", "wontWork"), null);
    Tap("Connection Push 2", Con.Push("3456.Hobbies", "foo"), 1);
    Tap("Connection Push 3", Con.Push("3456.Hobbies", "bar"), 2);
    Tap("Connection Push 4", Con.Push("2345.Hobbies", "roo"), 1);

    Tap("Connection Pop 1", Con.Pop("3456"), null);
    Tap("Connection Pop 2", Con.Pop("3456.Hobbies"), "bar");
    Tap("Connection Pop 3", Con.Fetch("3456.Hobbies.length"), 1);
    Tap("Connection Pop 4", Con.Pop("3456.Hobbies"), "foo");
    Tap("Connection Pop 5", Con.Fetch("3456.Hobbies.length"), 0);
    Tap("Connection Pop 6", Con.Pop("3456.Hobbies"), undefined);
    Tap("Connection Pop 7", Con.Fetch("3456.Hobbies.length"), 0);

    Tap("Connection Evict 4", Con.Evict("3456").CacheSize, 2);

    Tap("Connection Push 5", Con.Push("3456.Hobbies", "goo"), 1);
    Tap("Connection Push 6", Con.Push("3456.Hobbies", "loo"), 2);

    Tap("Connection Remove 1", Con.Remove("3456", F => F === "goo"), null);
    Tap("Connection Remove 2", Con.Remove("3456.Hobbies", F => F === "foo"), 2);
    Tap("Connection Remove 3", Con.Remove("3456.Hobbies", 5), 2);
    Tap("Connection Remove 4", Con.Remove("3456.Hobbies", 1), 1);

    Tap("Connection Push 6", Con.Push("3456.Hobbies", "loo"), 2);
    Tap("Connection Push 7", Con.Push("3456.Hobbies", "1", "2", "3"), 5);

    Tap("Connection Shift 1", Con.Shift("3456.Hobbies"), "goo");
    Tap("Connection Shift 2", Con.Shift("3456.Hobbies", "-5"), 5);
    Tap("Connection Shift 3", Con.Shift("3456.Hobbies", "one", "two", "three"), 8);

    Tap("Connection Set 10", Con.Set("2345.Hobbies", ["one", "two", "three", "four"]).Fetch("2345.Hobbies.length"), 4);

    Tap("Connection Slice 1", Con.Slice("3456.Hobbies"), 8);
    Tap("Connection Slice 1", Con.Slice("3456.Hobbies", 1), 7);
    Tap("Connection Slice 1", Con.Slice("3456.Hobbies", 0, 5), 5);

    // Utility methods
    Tap("Connection Ensure 1", Con.Ensure("2345", {Name: "nope", Age: -1, Hobbies: []}), false);
    Tap("Connection Ensure 2", Con.Ensure("6789", {Name: "Untitled", Age: -1, Hobbies: []}), true);

    const Tr = Con.Transaction();

    Tap("Connection Modify 1", Con.Modify("6789.Name", Name => {
        Name = "moo";
        return Name;
    }), {Name: "moo", Age: -1, Hobbies: []});

    Tap("Connection Modify 2", Con.Modify("6789.Hobbies", Hob => {
        Hob.push({Programming: false});
        return Hob;
    }), {Name: "moo", Age: -1, Hobbies: [{Programming: false}]});

    Tap("Connection CacheSize 13", Con.CacheSize, 4);

    Tr.Commit();
    
    Tap("Connection CacheSize 14", Con.CacheSize, 4);
    Tap("Connection Fetch 7", Con.Fetch("6789"), {Name: "moo", Age: -1, Hobbies: [{Programming: false}]});

    Tap("Connection Invert 1", Con.Invert("6789.Hobbies.0.Programming"), true);
    Tap("Connection Invert 2", Con.Invert("6789.Hobbies.0.Programming"), false);
    Tap("Connection Invert 3", Con.Invert("6789.Hobbies.0.Programming"), true);
    Tap("Connection Invert 4", Con.Invert("6789.Hobbies.0.Programming"), false);

    // Transaction tests
    const Tr2 = Con.Transaction();

    Tap("Connection Set 11", Con.Set("foo", {bar: "roo!"}).Size, 5);
    Tap("Connection Fetch 8", Con.Fetch("foo"), {bar: "roo!"});

    Tap("Connection Size 15", Con.Size, 5);
    Tap("Connection CacheSize 16", Con.CacheSize, 5);

    Tap("Connection Invert 5", Con.Invert("6789.Name"), false);
    Tap("Connection Invert 6", Con.Fetch("6789.Name"), false);

    Tr2.Rollback();

    Tap("Connection Size 17", Con.Size, 4);
    Tap("Connection CacheSize 18", Con.CacheSize, 0);
    Tap("Connection Fetch 9", Con.Fetch("foo"), undefined);
    Tap("Connection Invert 7", Con.Fetch("6789.Name"), "moo");

    // Iterator methods
    let Results = [];

    Con.Each((_Row, Key) => {
        Results.push(Key);
    }, true);

    Tap("Connection Each", Results, ["4567", "2345", "3456", "6789"]);

    // Selection class
    Tap("Connection Select 1", Con.Select((_Row, Key) => {
        return Key === "3456";
    }).Holds, "QDB");

    Tap("Connection Select 2", Con.Select().Cache.size, 4);
    
    const Sel = Con.Select((_Row, Key) => Key.includes("4"));
    Tap("Connection Select 3", Sel.Cache.size, 3);

    Tap("Selection Keys 1", Sel.Keys, ["2345", "3456", "4567"]);

    Tap("Selection Values 1", Sel.Values, [
        {Name: "bar", Age: 30, Hobbies: ["one", "two", "three", "four"]},
        {Name: "roo", Age: 29, Hobbies: ["two", "three", "-5", "loo", "1"]},
        {Name: "goo", Age: 27, Hobbies: []}
    ]);

    Tap("Selection AsObject 1", Sel.AsObject, {
        "2345": {Name: "bar", Age: 30, Hobbies: ["one", "two", "three", "four"]},
        "3456": {Name: "roo", Age: 29, Hobbies: ["two", "three", "-5", "loo", "1"]},
        "4567": {Name: "goo", Age: 27, Hobbies: []}
    });

    const Sel4 = Sel.Clone();

    Tap("Selection Order 1", Sel.Order((a, b) => a.Age - b.Age).Keys, ["4567", "3456", "2345"]);
    Tap("Selection Filter 1", Sel.Filter((_Row, Key) => Key !== "3456").Cache.size, 2);

    Tap("Selection Limit 1", Sel.Limit(0, 3).Cache.size, 2);
    Tap("Selection Limit 2", Sel.Limit(1, 5).Cache.size, 1);
    Tap("Selection Limit 3", Sel.Limit(1).Cache.size, 0);

    const Sel2 = Con.Select();
    Tap("Selection Select 4", Sel2.Cache.size, 4);
    
    Sel2.Map((Val, Key) => {
        Val = {...Val};
        Val.foo = Key === "3456" ? "bar" : "roo";
        return Val;
    });

    Tap("Selection Map 1", Sel2.Cache.get("2345").foo, "roo");
    Tap("Selection Map 2", Sel2.Cache.get("3456").foo, "bar");
    Tap("Selection Map 3", Sel2.Cache.get("4567").foo, "roo");
    Tap("Selection Map 4", Sel2.Cache.get("6789").foo, "roo");

    Sel2.Group("foo");

    Tap("Selection Group 1", Object.keys(Sel2.Cache.get("bar")).length, 1);
    Tap("Selection Group 2", Object.keys(Sel2.Cache.get("roo")).length, 3);

    const Sel3 = Sel2.Clone();
    Sel3.Cache.set("boo", {Name: "boo", Age: 23, Hobbies: ["slep"]});

    Tap("Selection Clone 1", Sel3.Cache.size, 3);
    Tap("Selection Clone 2", Sel2.Cache.size, 2);

    // Object reference tests
    const Selection = require("../lib/Utility/Selection");

    const Projects = new Selection({
        fooProj: {UserId: "4567", Does: ["nothing", "foo"]},
        barProj: {UserId: "2345", Does: ["sleep"]},
        rooProj: {UserId: "4567", Does: ["mind read"]},
    }, "Projects");

    const CopySel4 = Sel4.Clone();
    Sel4.Join(Projects.Clone(), "UserId");

    Tap("Selection Join 1", Sel4.Cache.get("4567").Projects.fooProj.Does, ["nothing", "foo"]);
    Tap("Selection Join 2", Sel4.Cache.get("2345").Projects.barProj.Does, ["sleep"]);
    Tap("Selection Join 3", Sel4.Cache.get("4567").Projects.rooProj.Does, ["mind read"]);

    const CopyCloneSel4 = CopySel4.Clone();
    const CopyCloneSel5 = CopySel4.Clone();
    CopySel4.Join(Projects.Clone(), "UserId", "Customs");

    Tap("Selection Join 4", CopySel4.Cache.get("4567").Customs.fooProj.Does, ["nothing", "foo"]);
    Tap("Selection Join 5", CopySel4.Cache.get("2345").Customs.barProj.Does, ["sleep"]);
    Tap("Selection Join 6", CopySel4.Cache.get("4567").Customs.rooProj.Does, ["mind read"]);

    CopyCloneSel4.Join(Projects.Clone(), "UserId", false);

    Tap("Selection Join 7", CopyCloneSel4.Cache.get("4567").fooProj.Does, ["nothing", "foo"]);
    Tap("Selection Join 8", CopyCloneSel4.Cache.get("2345").barProj.Does, ["sleep"]);
    Tap("Selection Join 9", CopyCloneSel4.Cache.get("4567").rooProj.Does, ["mind read"]);

    CopyCloneSel5.Join(Projects.Clone().Map(Item => {
        Item.Example = {UserId: Item.UserId};
        return Item;
    }), "Example.UserId");

    Tap("Selection Join 10", CopyCloneSel5.Cache.get("4567").Projects.fooProj.Does, ["nothing", "foo"]);
    Tap("Selection Join 11", CopyCloneSel5.Cache.get("2345").Projects.barProj.Does, ["sleep"]);
    Tap("Selection Join 12", CopyCloneSel5.Cache.get("4567").Projects.rooProj.Does, ["mind read"]);

    Sel.Merge(Sel3, Sel4);

    Tap("Selection Merge 1", Sel.Cache.size, 6);
    Tap("Selection Merge 2", Sel3.Cache.size, 3);
    Tap("Selection Merge 3", Sel4.Cache.size, 3);

    Tap("Selection Merge 4", Sel.Keys, [
        "roo", "bar", "boo",
        "2345", "3456", "4567"
    ]);

    Tap("Selection Retrieve 1", Sel.Retrieve("bar"), {
        "3456": {Name: "roo", Age: 29, Hobbies: ["two", "three", "-5", "loo", "1"], foo: "bar"}
    });

    Tap("Selection Retrieve 2", Sel.Retrieve("bar.Age"), undefined);
    Tap("Selection Retrieve 3", Sel.Retrieve("bar.3456.Age"), 29);
    Tap("Selection Retrieve 4", Sel.Retrieve("bar.3456.Hobbies.length"), 5);

    Con.Disconnect();

    // Pool class
    const Pl = new QDB.Pool("Test/");

    Tap("Pool Size 1", Pl.Store.size, 1);

    Tap("Pool Select 1", Pl.Select("Users"), Pl.Store.first());
    Tap("Pool Select 2", Pl.Select("Guilds"), undefined);
    Tap("Pool Select 3", Pl.Select("QDB"), undefined);

    Tap("Pool Connection", Pl.Select("Users").Size, 4);

    Pl.Disconnect();

    Tap("Pool Disconnect", Pl.Store.size, 0);

}
