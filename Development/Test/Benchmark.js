
const QDB = require("../../QDB");
const MyDB = new QDB.Connection("Development/Test/Users.qdb");

console.log(MyDB.API);

console.log(MyDB.Size);

MyDB.Disconnect();

console.log(MyDB);