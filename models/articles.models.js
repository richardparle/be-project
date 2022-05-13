const db = require("../db/connection");
const { sort } = require("../db/data/test-data/articles");

exports.fetchArticleById = async (articleId) => {
  const result1 = await db.query(
    `SELECT articles.*,
      COUNT(comment_id) :: int AS comment_count
      FROM articles
      LEFT JOIN comments
      ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id
      LIMIT 1;`,
    [articleId]
  );
  if (result1.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Path not found" });
  }

  return result1.rows[0];
};

exports.updateArticleById = (articleId, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, articleId]
    )
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return data.rows[0];
    });
};

exports.fetchArticles = (sort_by, topic, order) => {
  if (!sort_by || sort_by === "date") sort_by = "created_at";

  if (!order) order = "desc";

  if (order && !["asc", "desc"].includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Please enter a valid order query",
    });
  }

  const validColumns = [
    "title",
    "author",
    "article_id",
    "votes",
    "created_at",
    "comment_count",
    "topic",
  ];

  if (sort_by && !validColumns.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Please enter a valid sort_by query",
    });
  }

  let propData = [];

  let queryStr = `SELECT articles.*,
  COUNT(comment_id) :: int AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id`;

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    propData.push(topic);
  }

  if (sort_by) {
    queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;
  } else {
    queryStr += ` GROUP BY articles.article_id ORDER BY created_at ASC;`;
  }

  return db.query(queryStr, propData).then((data) => {
    return data.rows;
  });
};
