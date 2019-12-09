const express = require("express");
const app = express();
const apiRouter = require("./routes/api");

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  const psqlCodes = ["22P02", "23503"];

  if (psqlCodes.includes(err.code)) res.status(400).send({ msg: err.message });
  else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});
// app.use((err, req, res, next) => {
//   res.status(404).send({ msg: "Invalid article Id" });
// });

// app.use((err, req, res, next) => {
//   res.status(400).send({ msg: "bad request!" });
// });

// app.all("/*", (req, res, next) => {
//   res.status(404).send({ msg: "Route not found" });
// });
module.exports = app;
