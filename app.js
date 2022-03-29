const express = require("express");
const {
  getTopics,
  pathNotFoundErr,
} = require("./controllers/news.controllers");
const app = express();

app.use(express.json());

// GET requests
app.get("/api/topics", getTopics);

// Error handling
app.all("/*", pathNotFoundErr);

module.exports = app;
