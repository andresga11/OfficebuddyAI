const express = require("express");
const app = express();
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.json({ limit: "10mb" }));

let db = new sqlite3.Database("obai.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the access database.");
});

app.post("/validatePassword", (req, res) => {
  const { email, pass } = req.body;

  db.all(
    `select * from accounts where email = "${email}" and password = "${pass}"`,
    (err, rows) => {
      if (err) {
        throw err;
      }
      if (rows.length > 0) {
        res.send({ validation: true });
      } else {
        res.send({ validation: false });
      }
    }
  );
});

app.post("/registerUser", (req, res) => {
  const { email, pass, name } = req.body;

  db.run(
    `INSERT INTO accounts (name, email, password) values ("${name}","${email}","${pass}")`,
    (err) => {
      if (err) {
        throw err;
      } else {
        res.send({ validation: true });
      }
    }
  );
});

app.listen(3005, () => console.log("listening at port 3005"));
