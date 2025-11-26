import db from "../db/connection.js";

// Get all tags
function getAll() {
  return db.prepare("SELECT * FROM users ORDER BY name ASC").all();
}

// Get users associated with a specific post
/*function getUserForPost(postId) {
  const sql = `
    SELECT *
    FROM users
    WHERE = ?
  `;
  return db.prepare(sql).all(postId);
}
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  nickname TEXT,
  email TEXT,
  avatar TEXT,
  bio TEXT,
  created_at TEXT DEFAULT (CURRENT_TIMESTAMP)
);
*/

function getUserById(id) {
  return db.prepare("SELECT * FROM users WHERE Id = ?").get(id);
}
function getUserByIdForPost(id) {
  return db.prepare("SELECT name, nickname FROM users WHERE Id = ?").get(id);
}

function findByName(name) {
  return db.prepare("SELECT * FROM users WHERE name = ?").get(name);
}

function findByNickname(nickname) {
  return db.prepare("SELECT * FROM users WHERE nickname = ?").get(nickname);
}

function insert(name, nickname, email, avatar, bio) {
  const existing = findByName(name);
  if (existing) return existing;

  const stmt = db.prepare("INSERT INTO users (name, nickname, email, avatar, bio) VALUES (?)");
  const result = stmt.run(name, nickname, email, avatar, bio);
  return { id: result.lastInsertRowid, name };
}

function removeUserById(userId) {
  db.prepare("DELETE FROM user WHERE id = ?").run(userId);
}

export default { getUserById , getUserByIdForPost };
