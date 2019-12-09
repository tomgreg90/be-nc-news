const connection = require("../db/connection");

const fetchUserByUsername = username => {
  console.log("in users model");
  return connection("users")
    .where("username", username)
    .then(user => {
      if (!user.length)
        return Promise.reject({ status: 404, msg: "User does not exist!" });
      return user;
    });
};

module.exports = { fetchUserByUsername };
