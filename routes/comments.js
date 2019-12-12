const commentsRouter = require("express").Router();
const { updateComments, deleteComment } = require("../controllers/comments");
const { methodError } = require("../methodErrs/index");

commentsRouter
  .route("/:comment_id")
  .patch(updateComments)
  .delete(deleteComment)
  .all(methodError);

module.exports = commentsRouter;
