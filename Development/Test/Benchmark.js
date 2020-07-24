
const QDB = require("../../QDB");
const MyDB = new QDB.Connection("Development/Test/Users.qdb");

MyDB.Set("9a51dy", {
    Name: "QSmally",
    Age: 19,
    Hobbies: ["Programming", "Sleeping"]
});

MyDB.Set("9a51dy.Age", 20);

console.log(MyDB.Fetch("9a51dy"));

console.log(MyDB.Fetch("9a51dy.Hobbies.0"));

MyDB.Disconnect();
