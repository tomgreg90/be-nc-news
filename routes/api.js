const apiRouter = require("express").Router();
const topicsRouter = require("./topics");
const userRouter = require("./users");
const articleRouter = require("./articles");
const commentsRouter = require("./comments");
const { methodError } = require("../methodErrs/index");
const { getEndpoints } = require("../controllers/api");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter
  .route("/")
  .get(getEndpoints)
  .all(methodError);
module.exports = apiRouter;
