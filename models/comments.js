const connection = require("../db/connection");

const changeComment = (id, body) => {
  const { inc_votes } = body;
  const keys = Object.keys(body);

  const commentKeys = ["comment_id", "created_at", "author", "body"];

  if (commentKeys.includes(keys[0]))
    return Promise.reject({
      status: 400,
      msg: `You may not change ${keys[0]}!`
    });

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

const removeComment = id => {
  console.log("removing comment");
  console.log(id);
  return connection("comments")
    .where("comment_id", id)
    .del()
    .returning("*")
    .then(comment => {
      if (!comment.length)
        return Promise.reject({ status: 404, msg: "comment does not exist!" });
    });
};

module.exports = { changeComment, removeComment };
