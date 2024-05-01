// Load the mysql library
// import mysql from "mysql";
// import express from "express";
// const router = express.Router();



// router.get("/data", async (req, res) => {
//     // Create a connection to the database
//     const connection = mysql.createConnection({
//     host: "localhost", 
//     user: "user1",
//     password: "password123",
//     database: "employees",
//     });
  
//     // Connect to the database
//     connection.connect((err) => {
//     if (err) {
//       return console.error("error connecting: " + err.stack);
//     }
//     console.log("connected as id " + connection.threadId);
//     });
  
//   // Perform queries
//      connection.query("SELECT * FROM dept_emp", (err, results, fields) => {
//     if (err) throw err;
//     console.log(results);
//     });

//     // Close the connection
//     connection.end();
// })



// export default router;
