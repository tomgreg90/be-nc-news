exports.up = function(knex) {
  console.log("creating comments table");
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
  });
};

exports.down = function(knex) {
  console.log("dropping table comments!");
  return knex.schema.dropTable("comments");
};
