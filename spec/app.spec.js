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
        .then(({ body: { topics } }) => {
          expect(topics.topics).to.be.an("array");
          expect(topics.topics[0]).to.have.keys(["slug", "description"]);
        });
    });
  });
  describe("/users/:username", () => {
    it("GET returns status 200 with a user object", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("object");
          expect(body).to.have.keys(["username", "avatar_url", "name"]);
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    it("GET returns status 200 with an article object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body[0]).to.be.an("object");
          expect(body[0]).to.have.keys([
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
          expect(body.msg).to.equal("Invalid article Id");
        });
    });
    it("PATCH returns status 200 with an updated article object", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: 7 })
        .expect(200)
        .then(({ body }) => {
          expect(body[0]).to.be.an("object");
          expect(body[0]).to.have.keys([
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at"
          ]);
          expect(body[0].votes).to.equal(7);
        });
    });
    it("PATCH returns status 400 if inc_votes is not a number", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: "five" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request!");
        });
    });
    describe("/api/articles/:article_id/comments", () => {
      it("POST returns status 201 with the posted comment", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({ username: "rogersop", body: "fascinating article" })
          .expect(201)
          .then(({ body }) => {
            expect(body[0]).to.be.an("object");
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
      it("POST returns status 404 when given an invalid username", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({ username: "tomgreg", body: "not a real comment" })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid username!");
          });
      });
      it("POST returns status 400 when passed a comment in the wrong format", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send(["username: rogersop", "body: not a real comment"])
          .expect(400)
          .then(err => {
            expect(err.text).to.equal("Bad Request Invalid Comment!");
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
});
