const {
  fetchArticleById,
  changeArticleVotes,
  sendComment,
  fetchCommentsByArticleId,
  fetchArticles
} = require("../models/articles");
const { fetchUserByUsername } = require("../models/users");
const { fetchTopicByName } = require("../models/topics");

exports.getArticleById = (req, res, next) => {
  const { id } = req.params;

  fetchArticleById(id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      return next(err);
    });
};

exports.updateArticleVotes = (req, res, next) => {
  console.log("updating article votes!");

  const { id } = req.params;

  changeArticleVotes(id, req.body)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      return next(err);
    });
};

exports.postComment = (req, res, next) => {
  const comment = req.body;
  const { id } = req.params;

  sendComment(id, comment)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(err => {
      return next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { id } = req.params;

  fetchCommentsByArticleId(id, req.query)
    .then(comments => {
      res.status(200).send(comments);
    })
    .catch(err => {
      return next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { author, topic } = req.query;

  console.log("getting the articles!");
  Promise.all([
    fetchArticles(req.query),
    fetchUserByUsername(author),
    fetchTopicByName(topic)
  ])
    .then(result => {
      const articles = result[0];

      res.status(200).send({ articles });
    })
    .catch(err => {
      return next(err);
    });
};
