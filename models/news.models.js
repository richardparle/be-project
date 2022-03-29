const db = require("../db/connection");

exports.selectAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((data) => {
    return data.rows;
  });
};

exports.selectArticleById = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then((data) => {
      return data.rows[0];
    });
};
