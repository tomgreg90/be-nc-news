const articleRouter = require("express").Router();
const {
  getArticleById,
  updateArticleVotes,
  postComment,
  getCommentsByArticleId
} = require("../controllers/articles");

articleRouter
  .route("/:id")
  .get(getArticleById)
  .patch(updateArticleVotes);

articleRouter.post("/:id/comments", postComment);
articleRouter.get("/:id/comments", getCommentsByArticleId);

module.exports = articleRouter;
