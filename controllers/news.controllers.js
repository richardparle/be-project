const { selectAllTopics, selectArticleById } = require("../models/news.models");

exports.getTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => next(err));
};

exports.pathNotFoundErr = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((data) => {
      res.status(200).send({ msg: data });
    })
    .catch((err) => next(err));
};
