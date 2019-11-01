const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics");
topicsRouter.route("/").get(getTopics);

topicsRouter.get("/api/topics", getTopics);

module.exports = topicsRouter;
