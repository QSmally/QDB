
module.exports = (QDB, tap) => {
    const con = new QDB.Connection("Test/Users.qdb");
    tap("Connection", con.state, "CONNECTED");

    con.erase(...con.indexes);
    tap("Connection Clear 1", con.size, 0);
    tap("Connection Clear 2", con.asObject(), {});

    // Base Connection functions
    tap("Connection Set 1", con.set("1234", { name: "foo", age: 26 }).size, 1);
    tap("Connection CacheSize 1", con.cacheSize, 0);
    tap("Connection Set 2", con.set("2345", { name: "bar", age: 21 }).size, 2);
    tap("Connection CacheSize 2", con.cacheSize, 0);
    tap("Connection Size 1", con.size, 2);

    tap("Connection Fetch 1", con.fetch("2345"), { name: "bar", age: 21 });
    tap("Connection CacheSize 3", con.cacheSize, 1);
    tap("Connection Size 2", con.size, 2);

    tap("Connection Access 1", con.fetch("2345.name"), "bar");
    tap("Connection Access 2", con.fetch("2345.name.length"), 3);
    tap("Connection Access 3", con.fetch("2345.age"), 21);
    tap("Connection Access 3", con.fetch("2345.age.not.exists"), undefined);
    tap("Connection Access 4", con.fetch("2345.none"), undefined);
    tap("Connection Access 5", typeof con.fetch("2345._timestamp"), "number");
    tap("Connection Access 6", con.cacheSize, 1);

    tap("Connection Fetch 2", con.fetch("1234"), { name: "foo", age: 26 });
    tap("Connection CacheSize 4", con.cacheSize, 2);
    tap("Connection Size 3", con.size, 2);

    tap("Connection Fetch 3", con.fetch("2345"), { name: "bar", age: 21 });
    tap("Connection CacheSize 5", con.cacheSize, 2);
    tap("Connection Size 4", con.size, 2);

    tap("Connection Evict 1", con.evict("2345").cacheSize, 1);

    tap("Connection Set 3", con.set("3456", { name: "roo", age: 29 }).size, 3);
    tap("Connection CacheSize 6", con.cacheSize, 1);
    tap("Connection Set 4", con.set("4567", { name: "goo", age: 27 }).size, 4);
    tap("Connection CacheSize 7", con.cacheSize, 1);
    tap("Connection Size 5", con.size, 4);

    tap("Connection Fetch 4", con.fetch("3456"), { name: "roo", age: 29 });
    tap("Connection Fetch 5", con.fetch("2345"), { name: "bar", age: 21 });
    tap("Connection Fetch 6", con.fetch("1234"), { name: "foo", age: 26 });
    tap("Connection Fetch 5", con.fetch("4567"), { name: "goo", age: 27 });
    tap("Connection Evict 2", con.evict("2345", "3456").cacheSize, 2);

    tap("Connection Erase 1", con.erase("1234").size, 3);
    tap("Connection CacheSize 8", con.cacheSize, 1);

    // Lookup methods
    tap("Connection Exist 1", con.exists("1234"), false);
    tap("Connection Exist 2", con.exists("2345"), true);
    tap("Connection Exist 3", con.exists("6789"), false);
    tap("Connection CacheSize 9", con.cacheSize, 2);

    tap("Connection Find 1", con.find((_e, i) => i.startsWith("34")), { name: "roo", age: 29 });
    tap("Connection CacheSize 10", con.cacheSize, 2);

    tap("Connection Find 2", con.find((_e, i) => i === "1289"), undefined);
    tap("Connection CacheSize 11", con.cacheSize, 2);

    tap("Connection Find 3", con.find((_e, i) => i.startsWith("34")), { name: "roo", age: 29 });
    tap("Connection CacheSize 12", con.cacheSize, 2);

    tap("Connection Evict 3", con.evict().cacheSize, 0);

    tap("Connection Set 5", con.set("2345.age", 30).size, 3);
    tap("Connection Fetch 6", con.fetch("2345"), { name: "bar", age: 30 });

    // Array methods
    const idxList = con.indexes;
    for (const idx in idxList)
        tap(`Connection Set ${parseInt(idx) + 6}`, con.set(`${idxList[idx]}.hobbies`, []).size, 3);

    tap("Connection Push 1", con.push("3456", "wontWork"), null);
    tap("Connection Push 2", con.push("3456.hobbies", "foo"), 1);
    tap("Connection Push 3", con.push("3456.hobbies", "bar"), 2);
    tap("Connection Push 4", con.push("2345.hobbies", "roo"), 1);

    tap("Connection Pop 1", con.pop("3456"), null);
    tap("Connection Pop 2", con.pop("3456.hobbies"), "bar");
    tap("Connection Pop 3", con.fetch("3456.hobbies.length"), 1);
    tap("Connection Pop 4", con.pop("3456.hobbies"), "foo");
    tap("Connection Pop 5", con.fetch("3456.hobbies.length"), 0);
    tap("Connection Pop 6", con.pop("3456.hobbies"), undefined);
    tap("Connection Pop 7", con.fetch("3456.hobbies.length"), 0);

    tap("Connection Evict 4", con.evict("3456").cacheSize, 2);

    tap("Connection Push 5", con.push("3456.hobbies", "goo"), 1);
    tap("Connection Push 6", con.push("3456.hobbies", "loo"), 2);

    tap("Connection Remove 1", con.remove("3456", F => F === "goo"), null);
    tap("Connection Remove 2", con.remove("3456.hobbies", F => F === "foo"), 2);
    tap("Connection Remove 3", con.remove("3456.hobbies", 5), 2);
    tap("Connection Remove 4", con.remove("3456.hobbies", 1), 1);

    tap("Connection Push 6", con.push("3456.hobbies", "loo"), 2);
    tap("Connection Push 7", con.push("3456.hobbies", "1", "2", "3"), 5);

    tap("Connection Shift 1", con.shift("3456.hobbies"), "goo");
    tap("Connection Shift 2", con.shift("3456.hobbies", "-5"), 5);
    tap("Connection Shift 3", con.shift("3456.hobbies", "one", "two", "three"), 8);

    tap("Connection Set 10", con.set("2345.hobbies", ["one", "two", "three", "four"]).fetch("2345.hobbies.length"), 4);

    tap("Connection Slice 1", con.slice("3456.hobbies"), 8);
    tap("Connection Slice 1", con.slice("3456.hobbies", 1), 7);
    tap("Connection Slice 1", con.slice("3456.hobbies", 0, 5), 5);

    // Utility methods
    tap("Connection Ensure 1", con.ensure("2345", { name: "nope", age: -1, hobbies: [] }), false);
    tap("Connection Ensure 2", con.ensure("6789", { name: "Untitled", age: -1, hobbies: [] }), true);

    const tr = con.transaction();

    tap("Connection Modify 1", con.modify("6789.name", name => {
        name = "moo";
        return name;
    }), {
        name: "moo", age: -1, hobbies: []
    });

    tap("Connection Modify 2", con.modify("6789.hobbies", hob => {
        hob.push({ programming: false });
        return hob;
    }), {
        name: "moo", age: -1, hobbies: [{ programming: false }]
    });

    tap("Connection CacheSize 13", con.cacheSize, 4);

    tr.commit();

    tap("Connection CacheSize 14", con.cacheSize, 4);
    tap("Connection Fetch 7", con.fetch("6789"), { name: "moo", age: -1, hobbies: [{ programming: false }]});

    tap("Connection Invert 1", con.invert("6789.hobbies.0.programming"), true);
    tap("Connection Invert 2", con.invert("6789.hobbies.0.programming"), false);
    tap("Connection Invert 3", con.invert("6789.hobbies.0.programming"), true);
    tap("Connection Invert 4", con.invert("6789.hobbies.0.programming"), false);

    // Transaction tests
    const tr2 = con.transaction();

    tap("Connection Set 11", con.set("foo", { bar: "roo!" }).size, 5);
    tap("Connection Fetch 8", con.fetch("foo"), { bar: "roo!" });

    tap("Connection Size 15", con.size, 5);
    tap("Connection CacheSize 16", con.cacheSize, 5);

    tap("Connection Invert 5", con.invert("6789.name"), false);
    tap("Connection Invert 6", con.fetch("6789.name"), false);

    tr2.rollback();

    tap("Connection Size 17", con.size, 4);
    tap("Connection CacheSize 17", con.cacheSize, 0);
    tap("Connection Fetch 9", con.fetch("foo"), undefined);
    tap("Connection Invert 7", con.fetch("6789.name"), "moo");

    // Iterator methods
    let results = [];

    con.each((_row, key) => {
        results.push(key);
    }, true);

    tap("Connection Each", results, ["4567", "2345", "3456", "6789"]);

    let results2 = [];

    for (const [id, documentObject] of con) {
        results2.push([id, documentObject]);
    }

    tap("Connection Iterator", results2, [
        ["4567", { name: "goo", age: 27, hobbies: [] }],
        ["2345", { name: "bar", age: 30, hobbies: ["one", "two", "three", "four"] }],
        ["3456", { name: "roo", age: 29, hobbies: ["two", "three", "-5", "loo", "1"] }],
        ["6789", { name: "moo", age: -1, hobbies: [{ programming: false }] }],
    ]);

    // Selection class
    tap("Connection Select 1", con.select((_row, key) => {
        return key === "3456";
    }).holds, "QDB");

    tap("Connection Select 2", con.select().cache.size, 4);
    
    const sel = con.select((_row, key) => key.includes("4"));
    tap("Connection Select 3", sel.cache.size, 3);

    tap("Selection Keys 1", sel.keys, ["2345", "3456", "4567"]);

    tap("Selection Values 1", sel.values, [
        { name: "bar", age: 30, hobbies: ["one", "two", "three", "four"] },
        { name: "roo", age: 29, hobbies: ["two", "three", "-5", "loo", "1"] },
        { name: "goo", age: 27, hobbies: [] }
    ]);

    tap("Selection AsObject 1", sel.asObject, {
        "2345": { name: "bar", age: 30, hobbies: ["one", "two", "three", "four"] },
        "3456": { name: "roo", age: 29, hobbies: ["two", "three", "-5", "loo", "1"] },
        "4567": { name: "goo", age: 27, hobbies: [] }
    });

    const sel4 = sel.clone();

    tap("Selection Order Arbitrary", sel.order((a, b) => a.age - b.age).keys, ["4567", "3456", "2345"]);
    tap("Selection Order Descending 1", sel.order(item => item.age, QDB.descending).keys, ["2345", "3456", "4567"]);
    tap("Selection Order Ascending", sel.order(item => item.age, QDB.ascending).keys, ["4567", "3456", "2345"]);
    tap("Selection Order Descending 2", sel.order(item => item.age, QDB.descending).keys, ["2345", "3456", "4567"]);
    tap("Selection Filter 1", sel.filter((_row, key) => key !== "3456").cache.size, 2);

    tap("Selection Limit 1", sel.limit(0, 3).cache.size, 2);
    tap("Selection Limit 2", sel.limit(1, 5).cache.size, 1);
    tap("Selection Limit 3", sel.limit(1).cache.size, 0);

    const sel2 = con.select();
    tap("Selection Select 4", sel2.cache.size, 4);

    sel2.map((val, key) => {
        val = {...val};
        val.foo = key === "3456" ? "bar" : "roo";
        return val;
    });

    tap("Selection Map 1", sel2.cache.get("2345").foo, "roo");
    tap("Selection Map 2", sel2.cache.get("3456").foo, "bar");
    tap("Selection Map 3", sel2.cache.get("4567").foo, "roo");
    tap("Selection Map 4", sel2.cache.get("6789").foo, "roo");

    sel2.group("foo");

    tap("Selection Group 1", Object.keys(sel2.cache.get("bar")).length, 1);
    tap("Selection Group 2", Object.keys(sel2.cache.get("roo")).length, 3);

    const sel3 = sel2.clone();
    sel3.cache.set("boo", { name: "boo", age: 23, hobbies: ["slep"] });

    tap("Selection Clone 1", sel3.cache.size, 3);
    tap("Selection Clone 2", sel2.cache.size, 2);

    // Object reference tests
    const Selection = require("../lib/Utility/Selection");

    const projects = new Selection({
        fooProj: { userId: "4567", does: ["nothing", "foo"]},
        barProj: { userId: "2345", does: ["sleep"]},
        rooProj: { userId: "4567", does: ["mind read"]},
    }, "projects");

    const copySel4 = sel4.clone();
    sel4.join(projects.clone(), "userId");

    tap("Selection Join 1", sel4.cache.get("4567").projects.fooProj.does, ["nothing", "foo"]);
    tap("Selection Join 2", sel4.cache.get("2345").projects.barProj.does, ["sleep"]);
    tap("Selection Join 3", sel4.cache.get("4567").projects.rooProj.does, ["mind read"]);

    const copyCloneSel4 = copySel4.clone();
    const copyCloneSel5 = copySel4.clone();
    copySel4.join(projects.clone(), "userId", "customs");

    tap("Selection Join 4", copySel4.cache.get("4567").customs.fooProj.does, ["nothing", "foo"]);
    tap("Selection Join 5", copySel4.cache.get("2345").customs.barProj.does, ["sleep"]);
    tap("Selection Join 6", copySel4.cache.get("4567").customs.rooProj.does, ["mind read"]);

    copyCloneSel4.join(projects.clone(), "userId", false);

    tap("Selection Join 7", copyCloneSel4.cache.get("4567").fooProj.does, ["nothing", "foo"]);
    tap("Selection Join 8", copyCloneSel4.cache.get("2345").barProj.does, ["sleep"]);
    tap("Selection Join 9", copyCloneSel4.cache.get("4567").rooProj.does, ["mind read"]);

    copyCloneSel5.join(projects.clone().map(item => {
        item.example = { userId: item.userId };
        return item;
    }), "example.userId");

    tap("Selection Join 10", copyCloneSel5.cache.get("4567").projects.fooProj.does, ["nothing", "foo"]);
    tap("Selection Join 11", copyCloneSel5.cache.get("2345").projects.barProj.does, ["sleep"]);
    tap("Selection Join 12", copyCloneSel5.cache.get("4567").projects.rooProj.does, ["mind read"]);

    sel.merge(sel3, sel4);

    tap("Selection Merge 1", sel.cache.size, 6);
    tap("Selection Merge 2", sel3.cache.size, 3);
    tap("Selection Merge 3", sel4.cache.size, 3);

    tap("Selection Merge 4", sel.keys, [
        "roo", "bar", "boo",
        "2345", "3456", "4567"
    ]);

    tap("Selection Retrieve 1", sel.retrieve("bar"), {
        "3456": { name: "roo", age: 29, hobbies: ["two", "three", "-5", "loo", "1"], foo: "bar" }
    });

    tap("Selection Retrieve 2", sel.retrieve("bar.age"), undefined);
    tap("Selection Retrieve 3", sel.retrieve("bar.3456.age"), 29);
    tap("Selection Retrieve 4", sel.retrieve("bar.3456.hobbies.length"), 5);

    con.disconnect();

    // Pool class
    const pl = new QDB.Pool("Test/");

    tap("Pool Size 1", pl.store.size, 1);

    tap("Pool Select 1", pl.select("Users"), pl.store.first());
    tap("Pool Select 2", pl.select("Guilds"), undefined);
    tap("Pool Select 3", pl.select("QDB"), undefined);

    tap("Pool Connection", pl.select("Users").size, 4);

    pl.disconnect();

    tap("Pool Disconnect", pl.store.size, 0);

    // Executors
    const eCon = new QDB.Connection("Test/Users.qdb", {
        fetchAll: true,
        cacheMaxSize: 2
    });

    tap("Connection Size 16", eCon.size, 4);
    tap("Connection CacheSize 18", eCon.cacheSize, 2);

    eCon.disconnect();
}
