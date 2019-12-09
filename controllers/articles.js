const {
  fetchArticleById,
  changeArticleVotes,
  sendComment,
  fetchCommentsByArticleId
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
  const { inc_votes } = req.body;
  const { id } = req.params;

  changeArticleVotes(id, inc_votes)
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
      console.log(err.message);
      return next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { id } = req.params;
  const sort = req.query;
  console.log(sort);
  fetchCommentsByArticleId(id, sort)
    .then(comments => {
      res.status(200).send(comments);
    })
    .catch(error => {
      console.log(error.code);
      return next(error);
    });
};
