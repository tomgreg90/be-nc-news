const express = require("express");
const app = express();
const apiRouter = require("./routes/api");
const cors = require("cors");
app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

process.env.NODE_TLS_REJECT_UNAUTHORIZED=0
process.env.DATABASE_REJECT_UNAUTHORIZED === false

app.use((err, req, res, next) => {
  const psqlCodes = ["22P02", "42703"];

  if (psqlCodes.includes(err.code))
    res.status(400).send({ msg: "Bad Request!" });
  else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  const psqlCodes = ["23503"];

  if (psqlCodes.includes(err.code)) res.status(404).send({ msg: err.message });
  else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
