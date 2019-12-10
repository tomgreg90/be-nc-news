const commentsRouter = require("express").Router();
const { updateComments } = require("../controllers/comments");

commentsRouter.route("/:comment_id").patch(updateComments);

module.exports = commentsRouter;
