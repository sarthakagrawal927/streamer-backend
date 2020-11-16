const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const _ = require("dotenv").config();

const connectDB = require("./startup/db");
const router = require("./startup/routes");

const app = express();

const port = process.env.PORT || 3000;
connectDB();

app.use(express.json());
app.use(morgan("dev"));

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
      credentials: true,
    })
  );
}

app.use("/", router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
