const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body from comments WHERE article_id = $1;`,
      [article_id]
    )
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return data.rows;
    });
};

exports.sendCommentByArticleId = async (username, body, article_id) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  const comment = await db.query(
    `INSERT INTO comments
       (body, article_id, author)
       VALUES
       ($1, $2, $3)
       RETURNING *;`,
    [body, article_id, username]
  );
  if (!comment || !comment.rows.length) {
    return Promise.reject({ status: 500, msg: "Unable to post comment" });
  }
  return comment.rows[0];
};
