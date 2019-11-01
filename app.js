const express = require("express");
const app = express();
const apiRouter = require("./routes/api");

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  console.log(err);
  const psqlCodes = ["22P02", "23503", "42703"];

  if (err.status) res.status(err.status).send(err.msg);

  if (err.code === psqlCodes[0]) res.status(400).send({ msg: "Bad Request!" });
  if (err.code === psqlCodes[1])
    res.status(404).send({ msg: "Invalid username!" });
  if (err.code === psqlCodes[2])
    res.status(400).send({ msg: "Invalid Column" });
  else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(404).send({ msg: "Invalid article Id" });
});

app.use((err, req, res, next) => {
  res.status(400).send({ msg: "bad request!" });
});
module.exports = app;
