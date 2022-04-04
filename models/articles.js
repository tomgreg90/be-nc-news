const connection = require("../db/connection");

const fetchArticleById = id => {
  return connection
    .select("articles.*")
    .count({ comment_count: "comment_id" })
    .from("articles")
    .where("articles.article_id", id)
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(articles => {
      if (!articles.length)
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      else {
        const article = articles.map(item => {
          item.comment_count = Number(item.comment_count);
          return item;
        });
        return article[0];
      }
    });
};

const changeArticleVotes = (id, query) => {
  const keys = Object.keys(query);
  const { inc_votes } = query;
  if (inc_votes === "undefined") inc_votes = 0;

  const articleKeys = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "comment_count"
  ];

  if (keys.length > 1)
    return Promise.reject({ status: 400, msg: "Incorrect query body!" });

  if (articleKeys.includes(keys[0]))
    return Promise.reject({
      status: 400,
      msg: `You may not change ${keys[0]}!`
    });

  if (keys[0] !== "inc_votes" && keys.length === 1)
    return Promise.reject({ status: 400, msg: "Incorrect query body!" });

  if (!keys.length || keys[0] === "inc_votes")
    return connection("articles")
      .where("article_id", "=", id)
      .increment("votes", inc_votes || 0)
      .returning("*")
      .then(article => {
        if (!article.length)
          return Promise.reject({
            status: 404,
            msg: "Article does not exist!"
          });

        return article[0];
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
        return comment[0];
      });
  }
};

const fetchCommentsByArticleId = (id, { sort_by, order }) => {
  if (order && order !== "asc" && order !== "desc")
    return Promise.reject({
      status: 400,
      msg: `cannot order by ${order}`
    });

  return connection("comments")
    .where("article_id", id)
    .select("*")
    .orderBy(sort_by || "created_at", order || "desc")

    .returning("*")
    .then(comments => {
      return comments.map(item => {
        delete item.article_id;
        return item;
      });
    });
};

const fetchArticles = ({ sort_by, order, author, topic }) => {

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
