const { sendComment } = require("../models/comments");

exports.postComment = (req, res, next) => {
  const comment = req.body;
  sendComment(comment).then(comment => {
    console.log(comment);
  });
};
