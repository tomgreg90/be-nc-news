const articleRouter = require("express").Router();
const {
  getArticleById,
  updateArticleVotes,
  postComment,
  getCommentsByArticleId,
  getArticles
} = require("../controllers/articles");

articleRouter
  .route("/:id")
  .get(getArticleById)
  .patch(updateArticleVotes);

articleRouter.route("/").get(getArticles);

articleRouter.post("/:id/comments", postComment);
articleRouter.get("/:id/comments", getCommentsByArticleId);

module.exports = articleRouter;
