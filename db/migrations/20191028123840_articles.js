exports.up = function(knex) {
  console.log("creating articles");
  return knex.createTable("articles", articleTable => {
    articleTable.increments("article_id").primary();
    articleTable.string("title").notNullable();
    articleTable.string("body").notNullable();
    articleTable.integer("votes").notNullable();
    articleTable.integer("topic");
    articleTable
      .foreign("topic")
      .references("slug")
      .inTable("topics");
    articleTable.string("author");
    articleTable
      .foreign("author")
      .refernces("username")
      .inTable("users");
    articleTable.dateTime("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {};
