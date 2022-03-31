const {
  fetchTopics,
  fetchArticleById,
  updateArticleById,
  fetchUsers,
  fetchArticles,
} = require("../models/articles.models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => next(err));
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleById(article_id, inc_votes)
    .then((data) => {
      res.status(200).send({ msg: data });
    })
    .catch((err) => next(err));
};

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send(users);
  });
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
