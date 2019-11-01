const connection = require("../db/connection");

const fetchArticleById = id => {
  console.log("in articles model");
  return connection
    .select("articles.*")
    .count({ comment_count: "comment_id" })
    .from("articles")
    .where("articles.article_id", id)
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(article => {
      if (article.length === 1) return article;
      else {
        Promise.reject(error);
      }
    });
};

const changeArticleVotes = (id, amount = 0) => {
  return connection("articles")
    .where("article_id", "=", id)
    .increment("votes", amount)
    .returning("*")
    .then(article => {
      return article;
    });
};

const sendComment = (id, comment) => {
  if (!comment.username || !comment.body) {
    return Promise.reject({ status: 400, msg: "Bad Request Invalid Comment!" });
  } else {
    return connection("comments")
      .insert({ author: comment.username, body: comment.body, article_id: id })
      .returning("*")
      .then(comment => {
        return comment;
      });
  }
};

fetchCommentsByArticleId = (id, { sort_by, order_by }) => {
  console.log({ sort_by });
  return connection("comments")
    .where("article_id", id)
    .select("*")
    .orderBy(sort_by || "created_at", order_by || "desc")

    .returning("*")
    .then(comments => {
      return comments;
    });
};

module.exports = {
  fetchArticleById,
  changeArticleVotes,
  sendComment,
  fetchCommentsByArticleId
};
