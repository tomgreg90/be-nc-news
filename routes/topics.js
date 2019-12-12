const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics");
const { methodError } = require("../methodErrs/index");
topicsRouter
  .route("/")
  .get(getTopics)
  .all(methodError);

module.exports = topicsRouter;
