const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  console.log("seeding");
  const topicsInsertions = knex("topics").insert(topicData);
  const usersInsertions = knex("users").insert(userData);

  return knex.migrate
    .rollback()
    .then(() => console.log("rollbakc") || knex.migrate.latest())
    .then(() => {
      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(() => {
      const cleanedArticleData = formatDates(articleData);
      console.log("hi");
      return knex("articles")
        .insert(cleanedArticleData)
        .returning("*");
    })
    .then(articleRows => {
      console.log("more seeding");
      const articleRef = makeRefObj(articleRows);

      const formattedComments = formatComments(commentData, articleRef);

      return knex("comments").insert(formattedComments);
    });
};
