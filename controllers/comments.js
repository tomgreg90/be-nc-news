const { changeComment, removeComment } = require("../models/comments");

exports.updateComments = (req, res, next) => {
  const { comment_id } = req.params;

  changeComment(comment_id, req.body)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(err => {
      return next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(err => {
      return next(err);
    });
};
