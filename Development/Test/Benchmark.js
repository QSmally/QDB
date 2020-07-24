
const QDB = require("../../QDB");
const MyDB = new QDB.Connection("Development/Test/Users.qdb");

console.log(MyDB.API);
console.log(MyDB.Size);

MyDB.Set("9a51dy", {
    Name: "QSmally",
    Age: 19,
    Hobbies: ["Programming", "Sleeping"]
});

console.log(MyDB.Size);

console.log(MyDB.Fetch("foo"));
console.log(MyDB.Fetch("9a51dy"));

console.log(MyDB.Cache);

MyDB.Disconnect();

console.log(MyDB);
