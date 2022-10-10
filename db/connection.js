const ENV = process.env.NODE_ENV || "development";
const knex = require("knex");
const parse = require("pg-connection-string").parse;

let pgConfig;

if(ENV === "production") {
  pgConfig = parse(process.env.DATABASE_URL);
  pgConfig.ssl = { rejectUnauthorized: false };
}

const dbConfig =
  ENV === "production"
<<<<<<< HEAD
    ? { client: "pg", connection: pgConfig }
=======
    ? { client: "pg", connection: process.env.DB_URL }
>>>>>>> 2b9fcd18c9e0ee5d7a495fea5555e39a1607334e
    : require("../knexfile");

module.exports = knex(dbConfig);
