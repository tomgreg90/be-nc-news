const { changeComment, removeComment } = require("../models/comments");

exports.updateComments = (req, res, next) => {
  console.log("upddating comment!");

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
  console.log("in comments controller");
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      console.log("comment removed");
      res.status(204).send();
    })
    .catch(err => {
      console.log(err.message);
      return next(err);
    });
};
