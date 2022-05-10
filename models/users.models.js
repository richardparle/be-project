const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query(`SELECT username from users;`).then((usernames) => {
    return usernames.rows;
  });
};
