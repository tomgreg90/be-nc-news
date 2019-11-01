const apiRouter = require("express").Router();
const topicsRouter = require("./topics");
const userRouter = require("./users");
const articleRouter = require("./articles");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);

module.exports = apiRouter;
