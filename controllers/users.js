const { fetchUserByUsername } = require("../models/users");

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then(user => {
      console.log(user);
      res.status(200).send({ user });
    })
    .catch(err => {
      return next(err);
    });
};
