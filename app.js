const express = require("express");
const app = express();
const {
  getTopics,
  getArticleById,
  patchArticleById,
  getUsers,
  getArticles,
  getCommentsByArticleId,
} = require("./controllers/articles.controllers");

app.use(express.json());

// GET requests
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

// PATCH requests
app.patch("/api/articles/:article_id", patchArticleById);

// Error handling
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") res.status(400).send({ msg: "Bad request" });
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
