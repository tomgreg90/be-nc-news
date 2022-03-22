const ENV = process.env.NODE_ENV || "development";
const { DB_URL } = process.env;

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  development: {
    connection: {
      database: "nc_news",
      username: "tomgreg90",
      password: "password"
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
      username: "tomgreg90",
      password: "password"
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`,
    ssl: { rejectUnauthorized: false }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
