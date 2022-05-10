const {
  fetchCommentsByArticleId,
  sendCommentByArticleId,
} = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  sendCommentByArticleId(username, body, article_id)
    .then((data) => {
      res.status(201).send({ data });
    })
    .catch((err) => {
      next(err);
    });
};
