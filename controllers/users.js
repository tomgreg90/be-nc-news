const { fetchUserByUsername } = require("../models/users");

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username).then(user => {
    res.status(200).send(user[0]);
  });
};
