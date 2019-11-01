const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an empty array when passed an empty array", () => {
    const input = [];
    const expected = [];
    const actual = formatDates(input);
    expect(actual).to.eql(expected);
    expect(actual).to.not.equal(input);
  });
  it("converts timestamp for a single object in an array into a javascript date object", () => {
    const input = [
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: 911564514171
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: new Date(911564514171)
      }
    ];

    expect(actual).to.deep.equal(expected);
    expect(actual).to.not.equal(input);
  });
  it("converts timestamp for multiple objects into a javascript date object", () => {
    const input = [
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: 911564514171
      },
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: 785420514171
      },
      {
        title: "Does Mitch predate civilisation?",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
        created_at: 659276514171
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: new Date(911564514171)
      },
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: new Date(785420514171)
      },
      {
        title: "Does Mitch predate civilisation?",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
        created_at: new Date(659276514171)
      }
    ];
    expect(actual).to.deep.equal(expected);
    expect(actual).to.not.equal(input);
  });
});

describe("makeRefObj", () => {
  it("returns an empty object when passed an empty array", () => {
    const input = [];
    const actual = makeRefObj(input);
    const expected = {};
    expect(actual).to.eql(expected);
  });
  it("returns an object with a single key-value pair when passed a single article", () => {
    const input = [
      {
        article_id: 1,
        title: "Running a Node App",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        votes: null,
        topic: "coding",
        author: "jessjelly"
      }
    ];
    const actual = makeRefObj(input);
    const expected = { "Running a Node App": 1 };
    expect(actual).to.eql(expected);
  });
  it("returns an object with a single key-value pair when passed a single article", () => {
    const input = [
      {
        article_id: 1,
        title: "Running a Node App",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        votes: null,
        topic: "coding",
        author: "jessjelly"
      },
      {
        article_id: 2,
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        body:
          "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
        votes: null,
        topic: "coding",
        author: "jessjelly"
      },
      {
        article_id: 3,
        title: "22 Amazing open source React projects",
        body:
          "This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.",
        votes: null,
        topic: "coding",
        author: "happyamy2016"
      }
    ];
    const actual = makeRefObj(input);
    const expected = {
      "Running a Node App": 1,
      "The Rise Of Thinking Machines: How IBM's Watson Takes On The World": 2,
      "22 Amazing open source React projects": 3
    };
    expect(actual).to.eql(expected);
  });
});

describe("formatComments", () => {
  it("returns an empty array when passed an empty array", () => {
    const input = [];
    const expected = [];
    const actual = formatComments(input);
    expect(actual).to.eql(expected);
  });
  it("correctly formats a single comment to correct key names and date", () => {
    const input = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "tickle122",
        votes: -1,
        created_at: 1468087638932
      }
    ];
    const articleRef = {
      "The People Tracking Every Touch, Pass And Tackle in the World Cup": 18,
      "Who are the most followed clubs and players on Instagram?": 19,
      "History of Football": 20
    };
    const actual = formatComments(input, articleRef);
    const expected = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        votes: -1,
        created_at: new Date(1468087638932),
        author: "tickle122",
        article_id: 18
      }
    ];
    expect(actual).to.deep.equal(expected);
    expect(actual).to.not.equal(input);
  });
  it("correctly formats multiple comments to correct key names and date", () => {
    const input = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "tickle122",
        votes: -1,
        created_at: 1468087638932
      },
      {
        body: "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
        belongs_to: "Making sense of Redux",
        created_by: "grumpy19",
        votes: 7,
        created_at: 1478813209256
      },
      {
        body:
          "Qui sunt sit voluptas repellendus sed. Voluptatem et repellat fugiat. Rerum doloribus eveniet quidem vero aut sint officiis. Dolor facere et et architecto vero qui et perferendis dolorem. Magni quis ratione adipisci error assumenda ut. Id rerum eos facere sit nihil ipsam officia aspernatur odio.",
        belongs_to: "22 Amazing open source React projects",
        created_by: "grumpy19",
        votes: 3,
        created_at: 1504183900263
      }
    ];
    const articleRef = {
      "The People Tracking Every Touch, Pass And Tackle in the World Cup": 18,
      "Making sense of Redux": 4,
      "22 Amazing open source React projects": 3
    };
    const actual = formatComments(input, articleRef);
    const expected = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        votes: -1,
        created_at: new Date(1468087638932),
        author: "tickle122",
        article_id: 18
      },
      {
        body: "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",

        article_id: 4,
        author: "grumpy19",
        votes: 7,
        created_at: new Date(1478813209256)
      },
      {
        body:
          "Qui sunt sit voluptas repellendus sed. Voluptatem et repellat fugiat. Rerum doloribus eveniet quidem vero aut sint officiis. Dolor facere et et architecto vero qui et perferendis dolorem. Magni quis ratione adipisci error assumenda ut. Id rerum eos facere sit nihil ipsam officia aspernatur odio.",
        article_id: 3,
        author: "grumpy19",
        votes: 3,
        created_at: new Date(1504183900263)
      }
    ];
    expect(actual).to.deep.equal(expected);
    expect(actual).to.not.equal(input);
  });
});
