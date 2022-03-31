const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((data) => {
    return data.rows;
  });
};

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

exports.fetchUsers = () => {
  return db.query(`SELECT username from users;`).then((usernames) => {
    return usernames.rows;
  });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.*,
   COUNT(comment_id) :: int AS comment_count
   FROM articles
   LEFT JOIN comments
   ON comments.article_id = articles.article_id
   GROUP BY articles.article_id ORDER BY created_at DESC;`
    )
    .then((data) => {
      return data.rows;
    });
};
