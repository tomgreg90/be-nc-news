exports.getEndpoints = (req, res, next) => {
  const endPoints = {
    "GET /api": {
      description:
        "Serves up a JSON representation of the availalbe endpoints of the api."
    },
    "GET /api/topics": {
      description: "serves an array of all topics",
      queries: [],
      exampleResponse: {
        topics: [{ slug: "football", description: "Footie!" }]
      }
    },
    "GET /api/users/:username": {
      description: "serves up an object containing details of a user",
      queries: [],
      exampleResponse: {
        username: "butter_bridge",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        name: "jonny"
      }
    },
    "GET /api/articles/:article_id": {
      description: "serves up the article specified by the article_id",
      queries: [],
      exampleResponse: {
        article_id: 1,
        title: "Living in the shadow of a great man",
        body: "I find this existence challenging",
        votes: 0,
        topic: "mitch",
        author: "butter_bridge",
        created_at: "2018-11-15T12:21:54.171Z",
        comment_count: 13
      }
    },
    "PATCH /api/articles/:article_id": {
      description: "changes the votes key by a given amount",
      queries: [],
      exampleResponse: {
        article_id: 1,
        title: "Living in the shadow of a great man",
        body: "I find this existence challenging",
        votes: 4,
        topic: "mitch",
        author: "butter_bridge",
        created_at: "2018-11-15T12:21:54.171Z",
        comment_count: 13
      }
    },
    "POST /api/articles/:article_id/comments": {
      description:
        "posts a comment to the given article specified by the article_id",
      queries: [],
      exampleResponse: {
        comment_id: 19,
        author: "rogersop",
        article_id: 3,
        votes: 0,
        created_at: "2019-12-12T14:19:29.097Z",
        body: "fascinating article"
      }
    },
    "GET /api/articles/:article_id/comments": {
      description: "serves up an array of comments specified by the article_id",
      queries: ["sort_by", "order"],
      exampleResponse: [
        {
          comment_id: 3,
          author: "icellusedkars",
          votes: 100,
          created_at: "2015-11-23T12:36:03.389Z",
          body:
            "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works."
        },
        {
          comment_id: 2,
          author: "butter_bridge",
          votes: 14,
          created_at: "2016-11-22T12:36:03.389Z",
          body:
            "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
        }
      ]
    },
    "GET /api/articles": {
      description: "serves up an array of the articles",
      queries: ["sort_by", "order"],
      exampleResponse: [
        {
          article_id: 11,
          title: "Am I a cat?",
          body:
            "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
          votes: 0,
          topic: "mitch",
          author: "icellusedkars",
          created_at: "1978-11-25T12:21:54.171Z",
          comment_count: "0"
        },
        {
          article_id: 12,
          title: "Moustache",
          body: "Have you seen the size of that thing?",
          votes: 0,
          topic: "mitch",
          author: "butter_bridge",
          created_at: "1974-11-26T12:21:54.171Z",
          comment_count: "0"
        }
      ]
    },
    "PATCH /api/comments/:comment_id": {
      description: "increments the vote count of a comment by a given amount",
      queries: [],
      exampleResponse: {
        comment_id: 1,
        author: "butter_bridge",
        article_id: 9,
        votes: 20,
        created_at: "2017-11-22T12:36:03.389Z",
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
      }
    },
    "DELETE /api/comments/:comment_id": {
      description: "deletes a comment serving up no content",
      queries: []
    }
  };
  res.status(200).send({ endPoints });
};
