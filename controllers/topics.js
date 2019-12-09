const { fetchTopics } = require("../models/topics");

exports.getTopics = (req, res, next) => {
  console.log("in topics controller");

  fetchTopics()
    .then(topics => {
      console.log("Here are the topics!");
      res.status(200).send(topics);
    })
    .catch(err => {
      console.log(err);
    });
};
