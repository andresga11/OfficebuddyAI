import express from "express";
import sqlite3 from "sqlite3";
const router = express.Router();


let db = new sqlite3.Database("obai.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the access database.");
});

router.post("/validatePassword", (req, res) => {
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

router.post("/registerUser", (req, res) => {
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

export default router;
