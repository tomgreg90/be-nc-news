exports.up = function(knex) {
  return knex.schema.createTable("comments", commentTable => {
    commentTable.increments("comment_id").primary();
    commentTable.string("author");
    commentTable
      .foreign("author")
      .references("username")
      .inTable("users");
    commentTable.integer("article_id");
    commentTable
      .foreign("article_id")
      .references("article_id")
      .inTable("articles");
    commentTable.integer("votes").defaultTo(0);
    commentTable.dateTime("created_at").defaultsTo(knex.fn.now());
    commentTable.text("body");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("comments");
};
