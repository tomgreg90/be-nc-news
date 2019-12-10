const apiRouter = require("express").Router();
const topicsRouter = require("./topics");
const userRouter = require("./users");
const articleRouter = require("./articles");
const commentsRouter = require("./comments");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
