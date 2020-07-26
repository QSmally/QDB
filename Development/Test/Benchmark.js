
const QDB = require("../../QDB");
const MyDB = new QDB.Connection("Development/Test/Users.qdb");

MyDB.API.prepare("DELETE FROM 'QDB' WHERE Key = ?").run("8v_65ver85b5");
MyDB.Set("8v_65ver85b5", {
    Name: "Molly",
    Age: 18,
    Description: "f"
});

// console.log({Cached: MyDB.CacheSize, Fetched: MyDB.Size, Rows: MyDB.API.prepare("SELECT * FROM 'QDB'").all(), Cache: MyDB.Cache});

console.log(MyDB.Fetch("8v_65ver85b5"));
console.log(MyDB.Fetch("p6_fhtkuyxtb"));
console.log(MyDB.Fetch("b5_lvee9uszh"));
console.log(MyDB.Fetch("8v_65ver85b5"));

MyDB.Set("8v_65ver85b5.Age", 200);

console.log(MyDB.Fetch("8v_65ver85b5"));

console.log({Cached: MyDB.CacheSize, Fetched: MyDB.Size, Rows: MyDB.API.prepare("SELECT * FROM 'QDB'").all(), Cache: MyDB.Cache});

MyDB.Disconnect();
