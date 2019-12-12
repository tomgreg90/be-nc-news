const userRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users");
const { methodError } = require("../methodErrs/index");
userRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(methodError);

module.exports = userRouter;
