const { selectAllTopics } = require("../models/news.models");

exports.getTopics = (req, res) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      res.status(500).send({ msg: "Server error" });
    });
};

exports.pathNotFoundErr = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};
