// const express = require("express");
// const cors = require("cors");
// const sqlite3 = require("sqlite3").verbose();
// const userRoute = require("./userRoute");
// const vectordbRoute = require("./vectordbRoute.js");
import express from "express";
import cors from "cors";
// import sqlite3 from "sqlite3";
import userRoute from "./userRoute.js";
import vectordbRoute from "./vectordbRoute.js";

// import mysqlRoute from "./mysqlServer.js"; 

const app = express();
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.json());
// app.use(express.json({ limit: "10mb" }));

// let db = new sqlite3.Database("obai.db", (err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log("Connected to the access database.");
// });

app.get("/", function (req,res) {
  res.sendFile(
    path.join(__dirname,"../client/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log("listening at port " + PORT));

app.use("/api/user", userRoute);
app.use("/api/vectordb", vectordbRoute);
// app.use("/api/mysql",mysqlRoute);