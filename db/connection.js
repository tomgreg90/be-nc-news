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
    ? { client: "pg", connection: pgConfig }
    : require("../knexfile");

module.exports = knex(dbConfig);
