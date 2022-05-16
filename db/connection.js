const ENV = process.env.NODE_ENV || "development";
const knex = require("knex");

console.log(process.env)

const dbConfig =
  ENV === "production"
    ? { client: "pg", connection: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : require("../knexfile");



module.exports = knex(dbConfig);
