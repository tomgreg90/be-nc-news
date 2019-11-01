const connection = require("../db/connection");

const fetchUserByUsername = username => {
  console.log("in users model");
  return connection("users")
    .where("username", username)
    .then(user => {
      return user;
    });
};

module.exports = { fetchUserByUsername };
