const connection = require("../db/connection");

const fetchTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .then(topics => {
      return topics;
    });
};

const fetchTopicByName = topic => {
  if (!topic) return;

  return connection("topics")
    .where("slug", topic)
    .then(topic => {
      if (!topic.length)
        return Promise.reject({ status: 404, msg: "topic does not exist!" });

      return topic;
    });
};

module.exports = { fetchTopics, fetchTopicByName };
