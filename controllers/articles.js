const {
  fetchArticleById,
  changeArticleVotes,
  sendComment,
  fetchCommentsByArticleId,
  fetchArticles
} = require("../models/articles");

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
  console.log("getting the articles!");
  fetchArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(err => {
      return next(err);
    });
};
