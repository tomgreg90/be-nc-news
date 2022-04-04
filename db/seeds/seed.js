const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {

  console.log("in seed file")
  process.env.NODE_TLS_REJECT_UNAUTHORIZED=0
  process.env.DATABASE_REJECT_UNAUTHORIZED === false

  const topicsInsertions = knex("topics").insert(topicData);
  const usersInsertions = knex("users").insert(userData);

  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(() => {
      const cleanedArticleData = formatDates(articleData);

      return knex("articles")
        .insert(cleanedArticleData)
        .returning("*");
    })
    .then(articleRows => {
      const articleRef = makeRefObj(articleRows);

      const formattedComments = formatComments(commentData, articleRef);

      return knex("comments").insert(formattedComments);
    });
};
