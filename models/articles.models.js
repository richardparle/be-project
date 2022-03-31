const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((data) => {
    return data.rows;
  });
};

exports.fetchArticleById = async (articleId) => {
  const result1 = await db.query(
    `SELECT articles.article_id 
    FROM comments 
    INNER JOIN articles
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1;`,
    [articleId]
  );
  const result2 = await db.query(
    `SELECT * FROM articles WHERE article_id = $1;`,
    [articleId]
  );

  const totalComments = result1.rows.length;
  const articleObj = result2.rows[0];
  articleObj.comment_count = totalComments;

  return articleObj;
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
