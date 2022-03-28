const { selectAllTopics } = require("../models/news.models");

exports.getTopics = (req, res) => {
  selectAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
