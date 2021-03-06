const express = require("express");
const app = express();
const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
} = require("./controllers/comments.controllers");
const {
  getArticleById,
  patchArticleById,
  getArticles,
} = require("./controllers/articles.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getUsers } = require("./controllers/users.controllers");
const { getApi } = require("./controllers/api.controllers");

app.use(express.json());

// GET requests
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api", getApi);

// PATCH requests
app.patch("/api/articles/:article_id", patchArticleById);

// POST requests
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

// DELETE requests
app.delete("/api/comments/:comment_id", deleteCommentById);

// Error handling
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") res.status(400).send({ msg: "Bad request" });
  else if (err.code === "23503") {
    res.status(404).send({ status: 404, msg: "Article not found" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server error" });
});

module.exports = app;
