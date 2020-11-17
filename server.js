const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const _ = require("dotenv").config();

const connectDB = require("./startup/db");
const router = require("./startup/routes");

const app = express();

const port = process.env.PORT || 5000;
connectDB();

app.use(express.json());
app.use(morgan("dev"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

app.use("/", router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
