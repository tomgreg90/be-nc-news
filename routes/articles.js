const articleRouter = require("express").Router();
const {
  getArticleById,
  updateArticleVotes,
  postComment,
  getCommentsByArticleId,
  getArticles
} = require("../controllers/articles");
const { methodError } = require("../methodErrs/index");

articleRouter
  .route("/:id")
  .get(getArticleById)
  .patch(updateArticleVotes)
  .all(methodError);

articleRouter
  .route("/")
  .get(getArticles)
  .all(methodError);

articleRouter
  .route("/:id/comments")
  .post(postComment)
  .get(getCommentsByArticleId)
  .all(methodError);

module.exports = articleRouter;
