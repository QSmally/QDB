
const { Connection } = require("../QDB");

const assert = require("node:assert");

const users = new Connection("Test/Users.qdb", {
    table: "Test"
});

// Connection: remove everything
    users.set("foo", { bar: "roo" }, { cache: false });
    users.API
        .prepare(`DELETE FROM ${users.table};`)
        .run();
    assert.strictEqual(users.size, 0);
    assert.strictEqual(users.cacheSize, 0);

const startTime = performance.now();

// Connection: basic interface
    const object = { foo: "bar", roo: "doo" };
    users.set("el1", object);

    assert.strictEqual(users.size, 1);
    assert.strictEqual(users.fetch("el0"), undefined);
    assert.deepStrictEqual(users.fetch("el1"), object);

    assert.strictEqual(users.exists("el1"), true);
    assert.strictEqual(users.exists("el0"), false);
    assert.strictEqual(users.cacheSize, 1);

    users.set("el2", { foo: "bar", roo: null });
    assert.strictEqual(users.exists("el2.roo"), true);
    assert.strictEqual(users.exists("el2.doo"), false);

    users.evict("el1");
    assert.strictEqual(users.cacheSize, 1);

    users.erase("el2");
    assert.strictEqual(users.size, 1);
    assert.strictEqual(users.cacheSize, 0);

// Connection: search
    assert.strictEqual(users.find(el => el.doo === "doo"), undefined);
    assert.deepStrictEqual(users.find(el => el.roo === "doo"), object);
    assert.deepStrictEqual(users.find(el => el.foo === "bar"), object);

users.disconnect();
console.info("Tests: passed");
console.info(`Tests: took ${Math.round((performance.now() - startTime) * 1e3) / 1e3} ms`);
