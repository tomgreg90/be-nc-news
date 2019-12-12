const connection = require("../db/connection");

const changeComment = (id, body) => {
  const keys = Object.keys(body);

  let { inc_votes } = body;

  if (inc_votes === undefined) inc_votes = 0;

  return connection("comments")
    .where("comment_id", "=", id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(comment => {
      if (!comment.length)
        return Promise.reject({
          status: 404,
          msg: "Comment does not exist!"
        });
      return comment[0];
    });
};

const removeComment = id => {
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
