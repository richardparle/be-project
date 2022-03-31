const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));

afterAll(() => {
  if (db.end) db.end();
});

describe("GET /api/topics", () => {
  test("200: responds with an array of topics containing 'slug' and 'description' properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body.topics).toBeInstanceOf(Array);
        expect(res.body.topics).toHaveLength(3);
        res.body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("404: responds with an error message when the endpoint is incorrect", () => {
    return request(app)
      .get("/api/topix")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with an object containg the following properties: author, title, article_id, body, topic, created_at, votes", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body.article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test('400: responds with "bad request" if article_id is not an integer', () => {
    return request(app)
      .get("/api/articles/five")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then((res) => {
        expect(res.body.msg).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 105,
        });
      });
  });
  test('400: responds with "bad request" if article_id is not an integer', () => {
    return request(app)
      .patch("/api/articles/one")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test('404: responds with "Path not found" if article_id does not match any of the articles', () => {
    return request(app)
      .patch("/api/articles/10000")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of objects, each with the property 'username'", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual([
          { username: "butter_bridge" },
          { username: "icellusedkars" },
          { username: "rogersop" },
          { username: "lurker" },
        ]);
      });
  });
  test("404: responds with an error message when the endpoint is incorrect", () => {
    return request(app)
      .get("/api/user")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/articles/:article_id (comment count)", () => {
  test("200: responds with an object containg a 'comment_count' property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          comment_count: 11,
        });
      });
  });
  test('400: responds with "bad request" if article_id is not an integer', () => {
    return request(app)
      .get("/api/articles/five")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test('404: responds with an error message for VALID but NON-EXISTENT article_id"', () => {
    return request(app)
      .get("/api/articles/5000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of articles containing 'slug' and 'description' properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles).toHaveLength(12);
        res.body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("404: responds with an error message when the endpoint is incorrect", () => {
    return request(app)
      .get("/api/articlez")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id ", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toEqual([
          {
            comment_id: 14,
            votes: 16,
            created_at: "2020-06-09T05:00:00.000Z",
            author: "icellusedkars",
            body: "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
          },
          {
            comment_id: 15,
            votes: 1,
            created_at: "2020-11-24T00:08:00.000Z",
            author: "butter_bridge",
            body: "I am 100% sure that we're not completely sure.",
          },
        ]);
      });
  });
  test('400: responds with "bad request" if article_id is not an integer', () => {
    return request(app)
      .get("/api/articles/five/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: responds with an error message when the endpoint is incorrect", () => {
    return request(app)
      .get("/api/articlez/5/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Path not found");
      });
  });
});
