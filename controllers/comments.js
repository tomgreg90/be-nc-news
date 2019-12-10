const changeComment = require("../models/comments");

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
