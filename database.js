const sqlite3 = require("sqlite3");

//connect to DB
const db = new sqlite3.Database("./obai.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});
