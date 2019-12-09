process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiSorted = require("chai-sorted");
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
    xit("PATCH 200 decreases article votes by a given amount", () => {
      return request(app)
        .patch("/api/articles/1")
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
          expect(body.article[0].votes).to.equal(96);
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
    it("POST returns status 400 when cpmment has incorrect keys", () => {
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

    it.only("GET returns status 200 and an array of comments", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("array");
          expect(body[0]).to.have.keys([
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          ]);
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
    it("GET returns status 400 with an error for an invalid sortBy column", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=number_of_likes")
        .expect(400)
        .then(error => {
          const errorBody = JSON.parse(error.text);

          expect(errorBody.msg).to.equal("Invalid Column");
        });
    });
    it("GET returns status 400 with an error for invalid query data type", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by={author}")
        .expect(400)
        .expect(error => {
          const errorBody = JSON.parse(error.text);

          expect(errorBody.msg).to.equal("Invalid Column");
        });
    });
  });
});
