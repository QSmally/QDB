
const { Connection } = require("../QDB");

const users = new Connection("Test/Users.qdb", {
    table: "Test"
});

users.API.prepare(`DELETE FROM ${users.table};`);
users.disconnect();
