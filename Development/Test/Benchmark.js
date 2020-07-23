
const QDB = require("../../QDB");

const MyDB = new QDB.Connection("./Development/Test/Users.sqlite");
console.log(MyDB);

console.log(MyDB.API);

console.log(MyDB.size);
console.log(MyDB.cacheSize);
