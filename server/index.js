import express from "express";
import cors from "cors";
import userRoute from "./userRoute.js";
import vectordbRoute from "./vectordbRoute.js";

const app = express();
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.json());

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
