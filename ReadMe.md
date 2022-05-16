# NorthCoders News Api

# Tom Gregory

## Welcome

Welcome to the backend of my Northcoders News api.

This is a reddit style news api where users can 

It runs on an express sever which listens to incoming requests from the front end, or which runs on your local computer, and will interact with an SQL database using knex.js as a query builder and perform GET, POST, PATCH and DELETE requests according to specific endpoints.

 simply follow this link! https://tomgreg-nc-news.herokuapp.com/api. All endpoints have a description and an example response in the form of a JSON object, as well as acceptable queries where applicable.

## To Install

Ensure you have the latest version of node.js installed and then simply fork and clone this repository using the command

```
git clone https://github.com/tomgreg90/be-nc-news.git
```

and then run

```bash
npm install
```

to install the relevant dependencies.

## To Start

To start the server run

```bash
npm start
```

and run localhost:9090 in your browser.

To view a list of the available endpoints begin with the /api endpoint, which will serve up a list of available endpoints as well as a description and sample response.

All GET requests serve up a JSON object/array containing the requested data. PATCH and POST requests accept JSON objects containing the relevant data.

PATCH /api/articles/:article_id accepts a JSON object in the form

```
{ inc_votes: newVote }
```

where newVote is the number of votes by which to increase the article votes.

POST /api/articles/:article_id/comments accepts a JSON object of the form

```
{username: "", body: ""}
```

where body is the comment you wish to post.

PATCH /api/comments/:comment_id accepts an object in the form

```
{ inc_votes: newVote }
```

## Testing

All endpoints are tested using supertest and tests can be run by running

```bash
npm test
```

Extensive testing is carried out on all endpoints to ensure data is provided in the correct format and errors are handled where bad requests are made to the api or data cannot be found.

For example:

```
describe("/topics", () => {
    it("GET returns status 200 with an array of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.be.an("array");
          expect(body.topics[0]).to.have.keys(["slug", "description"]);
        });
    });
```

returns an array of topics in the form of an object with the specified keys.

However:

```
it("GET responds with 404 if route not found", () => {
      return request(app)
        .get("/api/topcs")
        .expect(404)
        .then(err => {
          expect(err.body.msg).to.equal("Route not found");
        });
    });
```

returns an error message since this is an incorrect route.

POST and PATCH requests are tested to ensure posts are in the correct format and return the posted/updated item. For example:

```
it("PATCH returns status 200 with article object increased by votes", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: 7 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.be.an("object");
          expect(body.article).to.have.keys([
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at"
          ]);
          expect(body.article.votes).to.equal(13);
        });
```

responds with the correct updated article object.

Whereas:

```
it("PATCH returns status 404 if article_id does not exist", () => {
      return request(app)
        .patch("/api/articles/99")
        .send({ inc_votes: 7 })
        .expect(404)
        .then(err => {
          expect(err.body.msg).to.equal("Article does not exist!");
        });
    });
```

returns an error message since the article with an id of 99 does not exist.
