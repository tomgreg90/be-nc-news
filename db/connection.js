const ENV = process.env.NODE_ENV || "development";
const knex = require("knex");
const parse = require("pg-connection-string").parse;

let pgConfig;

if(ENV === "production") {
  process.env.DATABASE_URL = 'postgres://imeztcvfuxjyuu:f7b17e17245a6bed149ed1e8f636fc9f09d657bf288dfdbe821ebfd47c875baf@ec2-52-212-228-71.eu-west-1.compute.amazonaws.com:5432/d9sj87nkn4v8q8'
  pgConfig = parse(process.env.DATABASE_URL);
  pgConfig.ssl = { rejectUnauthorized: false };
}

const dbConfig =
  ENV === "production"
    ? { client: "pg", connection: pgConfig }
    : require("../knexfile");

module.exports = knex(dbConfig);
