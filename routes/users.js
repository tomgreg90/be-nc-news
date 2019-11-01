const userRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users");
userRouter.route("/").get(getUserByUsername);

userRouter.get("/:username", getUserByUsername);

module.exports = userRouter;
