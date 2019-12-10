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
      if (!article.length)
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      else {
        return article;
      }
    });
};

const changeArticleVotes = (id, query) => {
  const keys = Object.keys(query);
  const { inc_votes } = query;

  if (!keys.includes("inc_votes") || keys.length > 1)
    return Promise.reject({ status: 400, msg: "Incorrect query body!" });

  return connection("articles")
    .where("article_id", "=", id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(article => {
      if (!article.length)
        return Promise.reject({ status: 404, msg: "Article does not exist!" });
      return article;
    });
};

const sendComment = (id, comment) => {
  const commentKeys = Object.keys(comment);
  if (commentKeys.length > 2)
    return Promise.reject({ status: 400, msg: "Bad request invalid comment!" });
  if (!comment.username || !comment.body) {
    return Promise.reject({ status: 400, msg: "Bad request invalid comment!" });
  } else {
    return connection("comments")
      .insert({ author: comment.username, body: comment.body, article_id: id })
      .returning("*")
      .then(comment => {
        return comment;
      });
  }
};

const fetchCommentsByArticleId = (id, { sort_by, order_by }) => {
  console.log("getting the comments");

  return connection("comments")
    .where("article_id", id)
    .select("*")
    .orderBy(sort_by || "created_at", order_by || "desc")

    .returning("*")
    .then(comments => {
      if (!comments.length)
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      return comments.map(item => {
        delete item.article_id;
        return item;
      });
    });
};

const fetchArticles = ({ sort_by, order, author, topic }) => {
  console.log("getting articles");
  console.log(sort_by, order, author);

  return connection
    .select("articles.*")

    .count({ comment_count: "comment_id" })
    .from("articles")

    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by || "created_at", order || "desc")
    .modify(query => {
      if (author) query.where("articles.author", author);
      if (topic) query.where("articles.topic", topic);
    })
    .then(articles => {
      if (!articles.length)
        return Promise.reject({ status: 404, msg: "Invalid query!" });

      return articles;
    });
};

module.exports = {
  fetchArticleById,
  changeArticleVotes,
  sendComment,
  fetchCommentsByArticleId,
  fetchArticles
};
