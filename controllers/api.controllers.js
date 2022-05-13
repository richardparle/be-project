const { fetchApi } = require("../models/api.models");

exports.getApi = (req, res, next) => {
  fetchApi()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      next(err);
    });
};
