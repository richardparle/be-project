const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const data = require("../endpoints.json");

beforeEach(() => seed(testData));

afterAll(() => db.end());

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
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body).toHaveLength(12);
        res.body.forEach((article) => {
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
  test("200: Responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toHaveLength(2);
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
  test("404: responds with an error message when the endpoint is not found", () => {
    return request(app)
      .get("/api/articles/500/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with the posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "icellusedkars",
        body: "Hello",
      })
      .expect(201)
      .then((res) => {
        expect(res.body.data.body).toEqual("Hello");
      });
  });
  test("400: responds with 'bad request' if article_id is not an integer", () => {
    return request(app)
      .post("/api/articles/five/comments")
      .send({
        username: "icellusedkars",
        body: "Hello",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: responds with an error message when the endpoint is incorrect", () => {
    return request(app)
      .post("/api/articlez/5/comments")
      .send({
        username: "icellusedkars",
        body: "Hello",
      })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Path not found");
      });
  });
  test("404: responds with an error message when when the article_id doesn't exist", () => {
    return request(app)
      .post("/api/articles/500/comments")
      .send({
        username: "icellusedkars",
        body: "Hello",
      })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article not found");
      });
  });
});

describe("GET /api/articles (queries)", () => {
  test("200: sorts the articles by the column, defaulting to desc order on date", () => {
    return request(app)
      .get("/api/articles?sort_by=date")
      .expect(200)
      .then((res) => {
        expect(res.body).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200: order can either asc or desc", () => {
    return request(app)
      .get("/api/articles?sort_by=date&order=asc")
      .expect(200)
      .then((res) => {
        expect(res.body).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });
  test("200: filter the articles by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(1);
      });
  });
  test("400: invalid column to sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=month")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Please enter a valid sort_by query");
      });
  });
  test("400: invalid order query", () => {
    return request(app)
      .get("/api/articles?sort_by=date&order=down")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Please enter a valid order query");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: delete the given comment", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {});
  });
  test("400: comment_id cannot exist", () => {
    return request(app)
      .delete("/api/comments/five")
      .expect(400)
      .then(() => {});
  });
  test("404: comment_id could exist, but doesn't", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(() => {});
  });
});

describe("GET/api", () => {
  test("200: returns JSON object containing endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((result) => {
        expect(result.body).toEqual(data);
      });
  });
});
