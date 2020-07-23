
const QDB = require("../../QDB");
const MyDB = new QDB.Connection("Development/Test/Users.db");

console.log(MyDB.API);
