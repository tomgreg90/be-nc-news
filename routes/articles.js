const articleRouter = require("express").Router();
const {
  getArticleById,
  updateArticleVotes,
  postComment,
  getCommentsByArticleId
} = require("../controllers/articles");

articleRouter.route("/").get(getArticleById);

articleRouter.get("/:id", getArticleById);
articleRouter.patch("/:id", updateArticleVotes);
articleRouter.post("/:id/comments", postComment);
articleRouter.get("/:id/comments", getCommentsByArticleId);

module.exports = articleRouter;
