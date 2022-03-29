const express = require("express");
const app = express();
const {
  getTopics,
  pathNotFoundErr,
  getArticleById,
} = require("./controllers/news.controllers");

app.use(express.json());

// GET requests
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

// Error handling
app.all("/*", pathNotFoundErr);

app.use((err, req, res, next) => {
  if (err.code === "22P02") res.status(400).send({ msg: "Bad request" });
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server error" });
});

module.exports = app;
