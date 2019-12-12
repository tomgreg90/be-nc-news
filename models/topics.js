const connection = require("../db/connection");

const fetchTopics = () => {
  console.log("in topics model");
  return connection
    .select("*")
    .from("topics")
    .then(topics => {
      return { topics };
    });
};

const fetchTopicByName = topic => {
  if (!topic) return;
  console.log("fetching topic", topic);
  return connection("topics")
    .where("slug", topic)
    .then(topic => {
      if (!topic.length)
        return Promise.reject({ status: 404, msg: "topic does not exist!" });
      console.log(topic);
      return topic;
    });
};

module.exports = { fetchTopics, fetchTopicByName };
