const connection = require("../db/connection");

const changeComment = (id, body) => {
  const { inc_votes } = body;
  const keys = Object.keys(body);

  if (keys.length > 1 || !keys.includes("inc_votes"))
    return Promise.reject({ status: 400, msg: "Incorrect request body" });

  return connection("comments")
    .where("comment_id", "=", id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(comment => {
      if (!comment.length)
        return Promise.reject({ status: 404, msg: "Comment does not exist!" });
      return comment;
    });
};

module.exports = changeComment;
