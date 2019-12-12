process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiSorted = require("sams-chai-sorted");
chai.use(chaiSorted);
const connection = require("../db/connection");
const { expect } = chai;
const request = require("supertest");
const app = require("../app");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("/topics", () => {
    it("GET returns status 200 with an array of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics).to.be.an("array");
          expect(res.body.topics[0]).to.have.keys(["slug", "description"]);
        });
    });
    it("GET responds with 404 if route not found", () => {
      return request(app)
        .get("/api/topcs")
        .expect(404)
        .then(err => {
          expect(err.body.msg).to.equal("Route not found");
        });
    });
  });

  describe("/users/:username", () => {
    it("GET returns status 200 with a user object", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body }) => {
          expect(body.user).to.be.an("array");
          expect(body.user[0]).to.have.keys(["username", "avatar_url", "name"]);
          expect(body.user[0].username).to.equal("butter_bridge");
        });
    });
    it("GET responds with 404 and error message when username does not exist", () => {
      return request(app)
        .get("/api/users/butter_way")
        .expect(404)
        .then(err => {
          expect(err.body.msg).to.equal("User does not exist!");
        });
    });
  });

  describe("/api/articles/:article_id", () => {
    it("GET returns status 200 with an article object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.be.an("array");
          expect(body.article[0]).to.have.keys([
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at",
            "comment_count"
          ]);
        });
    });
    it("GET returns status 404 when requested a non-existent article", () => {
      return request(app)
        .get("/api/articles/99989")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Article does not exist");
        });
    });
    it("GET returns status 400 when article_id is not a number", () => {
      return request(app)
        .get("/api/articles/one")
        .expect(400)
        .then(err => {
          expect(err.body.msg).to.equal(
            'select "articles".*, count("comment_id") as "comment_count" from "articles" left join "comments" on "articles"."article_id" = "comments"."article_id" where "articles"."article_id" = $1 group by "articles"."article_id" - invalid input syntax for integer: "one"'
          );
        });
    });
    it("PATCH returns status 200 with article object increased by votes", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: 7 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.be.an("array");
          expect(body.article[0]).to.have.keys([
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at"
          ]);
          expect(body.article[0].votes).to.equal(7);
        });
    });

    it("PATCH returns status 404 if article_id does not exist", () => {
      return request(app)
        .patch("/api/articles/99")
        .send({ inc_votes: 7 })
        .expect(404)
        .then(err => {
          expect(err.body.msg).to.equal("Article does not exist!");
        });
    });
    it("PATCH returns status 400 if article_id is not a number", () => {
      return request(app)
        .patch("/api/articles/one")
        .send({ inc_votes: 4 })
        .expect(400)
        .then(err => {
          expect(err.body.msg).to.equal(
            'update "articles" set "votes" = "votes" + $1 where "article_id" = $2 returning * - invalid input syntax for integer: "one"'
          );
        });
    });
    it("PATCH returns status 400 if attempt is made to change another key", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ author: "tomgregory" })
        .expect(400)
        .then(err => {
          expect(err.body.msg).to.equal("You may not change author!");
        });
    });
    it("PATCH returns status 400 if inc_votes is not a number", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: "five" })
        .expect(400)
        .then(err => {
          expect(err.body.msg).to.equal(
            'update "articles" set "votes" = "votes" + $1 where "article_id" = $2 returning * - invalid input syntax for integer: "NaN"'
          );
        });
    });
    it("PATCH returns status 400 when patch body is in the wrong format", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ increase_votes: 4 })
        .expect(400)
        .then(err => {
          expect(err.body.msg).to.equal("Incorrect query body!");
        });
    });
    it("PATCH returns status 400 when patch body contains more than one key", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: 4, column: "votes" })
        .expect(400)
        .then(err => {
          expect(err.body.msg).to.equal("Incorrect query body!");
        });
    });
    describe("/api/articles/:article_id/comments", () => {
      it("POST returns status 201 with the posted comment", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({ username: "rogersop", body: "fascinating article" })
          .expect(201)
          .then(({ body }) => {
            expect(body.comment).to.be.an("array");
            expect(body.comment[0]).to.have.keys([
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            ]);
          });
      });
      it("POST returns status 404 when article does not exist", () => {
        return request(app)
          .post("/api/articles/99/comments")
          .send({ username: "rogersop", body: "fascinating article" })
          .expect(400)
          .then(err => {
            expect(err.body.msg).to.equal(
              'insert into "comments" ("article_id", "author", "body") values ($1, $2, $3) returning * - insert or update on table "comments" violates foreign key constraint "comments_article_id_foreign"'
            );
          });
      });
      it("POST returns status 400 if article_id is not a number", () => {
        return request(app)
          .post("/api/articles/four/comments")
          .send({ username: "rogersop", body: "fascinating article" })
          .expect(400)
          .then(err => {
            expect(err.body.msg).to.equal(
              'insert into "comments" ("article_id", "author", "body") values ($1, $2, $3) returning * - invalid input syntax for integer: "four"'
            );
          });
      });
      it("POST returns status 404 when given an invalid username", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({ username: "tomgreg", body: "not a real comment" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'insert into "comments" ("article_id", "author", "body") values ($1, $2, $3) returning * - insert or update on table "comments" violates foreign key constraint "comments_author_foreign"'
            );
          });
      });
      it("POST returns status 400 when comment has incorrect keys", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({ userme: "rogersop", body: "fascinating article" })
          .expect(400)
          .then(err => {
            expect(err.body.msg).to.equal("Bad request invalid comment!");
          });
      });
      it("POST returns status 400 when comment or username is not a string", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({ username: 2433234234, body: "fascinating article" })
          .expect(400)
          .then(err => {
            expect(err.body.msg).to.equal(
              'insert into "comments" ("article_id", "author", "body") values ($1, $2, $3) returning * - insert or update on table "comments" violates foreign key constraint "comments_author_foreign"'
            );
          });
      });
      it("POST returns status 400 when post comment has too many keys", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({
            username: "rogersop",
            body: "fascinating article",
            genre: "Sport"
          })
          .expect(400)
          .then(err => {
            expect(err.body.msg).to.equal("Bad request invalid comment!");
          });
      });
      it("returns status 400 when username or body is null", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({ username: null, body: "fascinating article" })
          .expect(400)
          .then(err => {
            expect(err.body.msg).to.equal("Bad request invalid comment!");
          });
      });

      it("GET returns status 200 and an array of comments", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.an("array");
            expect(body[0]).to.have.keys([
              "comment_id",
              "author",
              "votes",
              "created_at",
              "body"
            ]);
          });
      });
      it("GET returns status 200 when article_id does not exist", () => {
        return request(app)
          .get("/api/articles/99/comments")
          .expect(404)
          .then(err => {
            expect(err.body.msg).to.equal("Article does not exist");
          });
      });
      it("GET returns status 200 with comments sorted to default sort order", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.sortedBy("created_at", { descending: true });
          });
      });
      it("GET returns status 200 with comments sorted according to query", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=comment_id&order_by=desc")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.sortedBy("comment_id", { descending: true });
          });
      });
      it("GET returns status 400 with an error for an invalid sort_by column", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=number_of_likes")
          .expect(400)
          .then(err => {
            expect(err.body.msg).to.equal(
              'select * from "comments" where "article_id" = $1 order by "number_of_likes" desc - column "number_of_likes" does not exist'
            );
          });
      });
      it("GET returns status 400 if order_by anything other than asc or desc", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=comment_id&order_by=des")
          .expect(400)
          .then(err => {
            expect(err.body.msg).to.equal("cannot order by des");
          });
      });

      describe("/articles", () => {
        it("GET returns status 200 with an array of articles", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.an("array");
              expect(body.articles[0]).to.contain.keys([
                "article_id",
                "title",
                "body",
                "votes",
                "topic",
                "author",
                "created_at"
              ]);
            });
        });
        it("GET 200 articles have a comment count", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.an("array");

              expect(body.articles[0]).to.have.keys([
                "article_id",
                "title",
                "body",
                "votes",
                "topic",
                "author",
                "created_at",
                "comment_count"
              ]);
            });
        });
        it("GET 200 articles are sorted in descending order by date by default", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.an("array");

              expect(body.articles[0]).to.have.keys([
                "article_id",
                "title",
                "body",
                "votes",
                "topic",
                "author",
                "created_at",
                "comment_count"
              ]);

              expect(body.articles).to.be.sortedBy("created_at", {
                descending: true
              });
            });
        });
        it("GET 200 sorts articles by a given column", () => {
          return request(app)
            .get("/api/articles?sort_by=title")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.an("array");

              expect(body.articles[0]).to.have.keys([
                "article_id",
                "title",
                "body",
                "votes",
                "topic",
                "author",
                "created_at",
                "comment_count"
              ]);
              expect(body.articles).to.be.sortedBy("title", {
                descending: true
              });
            });
        });
        it("GET returns status 400 when sort_by query is invalid", () => {
          return request(app)
            .get("/api/articles?sort_by=rating")
            .expect(400)
            .then(err => {
              expect(err.body.msg).to.equal(
                'select "articles".*, count("comment_id") as "comment_count" from "articles" left join "comments" on "articles"."article_id" = "comments"."article_id" group by "articles"."article_id" order by "rating" desc - column "rating" does not exist'
              );
            });
        });
        it("GET returns status 400 when order_by is not asc or desc", () => {
          return request(app)
            .get("/api/articles/order_by=das")
            .expect(400)
            .then(err => {
              expect(err.body.msg).to.equal(
                'select "articles".*, count("comment_id") as "comment_count" from "articles" left join "comments" on "articles"."article_id" = "comments"."article_id" where "articles"."article_id" = $1 group by "articles"."article_id" - invalid input syntax for integer: "order_by=das"'
              );
            });
        });
        it("GET 200 filters the articles by author", () => {
          return request(app)
            .get("/api/articles?author=butter_bridge")
            .expect(200)
            .then(({ body }) => {
              for (let i = 0; i < body.articles.length; i++) {
                expect(body.articles[i].author).to.equal("butter_bridge");
              }
            });
        });
        it("GET returns 200 when author exists but has no articles", () => {
          return request(app)
            .get("/api/articles?author=lurker")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).to.equal(0);
            });
        });
        it("GET returns status 404 when author does not exist", () => {
          return request(app)
            .get("/api/articles?author=tomgregory")
            .expect(404)
            .then(err => {
              expect(err.body.msg).to.equal("User does not exist!");
            });
        });
        it("GET 200 filters articles by topic", () => {
          return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body }) => {
              for (let i = 0; i < body.articles.length; i++) {
                expect(body.articles[i].topic).to.equal("mitch");
              }
            });
        });
        it("GET returns status 200 when topic exists but has no entries", () => {
          return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).to.equal(0);
            });
        });
        it("GET returns status 404 when topic does not exist", () => {
          return request(app)
            .get("/api/articles?topic=football")
            .expect(404)
            .then(err => {
              expect(err.body.msg).to.equal("topic does not exist!");
            });
        });
      });
      describe("/comments/:comment_id", () => {
        it("PATCH returns status 200 and the comment with increased votes", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 4 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment[0].votes).to.equal(20);
            });
        });
        it("PATCH returns status 200 and the comment with decreased votes", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: -4 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment[0].votes).to.equal(12);
            });
        });
        it("PATCH returns status 404 when comment_id does not exist", () => {
          return request(app)
            .patch("/api/comments/99")
            .send({ inc_votes: -4 })
            .expect(404)
            .then(err => {
              expect(err.body.msg).to.equal("Comment does not exist!");
            });
        });
        it("PATCH returns status 400 if comment_id is not a number", () => {
          return request(app)
            .patch("/api/comments/one")
            .send({ inc_votes: 4 })
            .expect(400)
            .then(err => {
              expect(err.body.msg).to.equal(
                'update "comments" set "votes" = "votes" + $1 where "comment_id" = $2 returning * - invalid input syntax for integer: "one"'
              );
            });
        });
        it("PATCH returns status 400 when inc_votes is not a number", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: "four" })
            .expect(400)
            .then(err => {
              expect(err.body.msg).to.equal(
                'update "comments" set "votes" = "votes" + $1 where "comment_id" = $2 returning * - invalid input syntax for integer: "NaN"'
              );
            });
        });
        it("PATCH returns status 400 when request body is incorrect", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 4, column: "votes" })
            .expect(400)
            .then(err => {
              expect(err.body.msg).to.equal("Incorrect request body");
            });
        });
        it("PATCH returns status 400 when request body is incorrect", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ increase_votes: 4 })
            .expect(400)
            .then(err => {
              expect(err.body.msg).to.equal("Incorrect request body");
            });
        });
        it("PATCH returns status 400 when user attempts to update another coloumn", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ author: "tomgregory" })
            .expect(400)
            .then(err => {
              expect(err.body.msg).to.equal("You may not change author!");
            });
        });
        it("DELETE returns status 204 with no content", () => {
          return request(app)
            .delete("/api/comments/1")
            .expect(204);
        });
        it("DELETE returns status 404 when comment_id does not exist", () => {
          return request(app)
            .delete("/api/comments/99")
            .expect(404)
            .then(err => {
              expect(err.body.msg).to.equal("comment does not exist!");
            });
        });
        it("DELETE returns status 400 when comment_id is not a number", () => {
          return request(app)
            .delete("/api/comments/one")
            .expect(400)
            .then(err => {
              expect(err.body.msg).to.equal(
                'delete from "comments" where "comment_id" = $1 returning * - invalid input syntax for integer: "one"'
              );
            });
        });
        it("DELETE returns status 404 with error message when route is not found", () => {
          return request(app)
            .delete("/api/commets/1")
            .expect(404)
            .then(err => {
              expect(err.body.msg).to.equal("Route not found");
            });
        });
      });
    });
  });
  describe("Invalid methods", () => {
    it("returns status 405 for invalid methods for /articles/article_id", () => {
      const invalidMethods = ["post", "delete", "put"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it("status 405 for invalid methods for /articles", () => {
      const invalidMethods = ["post", "patch", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it("status 405 for invalid methods for /articles/:id/comments", () => {
      const invalidMethods = ["delete", "patch"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles/1/comments")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it("status 405 for invalid methods for /comments/comment_id", () => {
      const invalidMethods = ["get", "post"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/comments/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it("status 405 for invalid methods for /topics", () => {
      const invalidMethods = ["post", "patch", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it("status 405 for invalid methods for /users/:username", () => {
      const invalidMethods = ["post", "patch", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/users/butter_bridge")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
});
