import db from "../db/connection.js";

// Get all tags
function getAll() {
  return db.prepare("SELECT * FROM tags ORDER BY name ASC").all();
}

// Get tags associated with a specific post
function getTagsForPost(postId) {
  const sql = `
    SELECT t.*
    FROM tags t
    JOIN posts_tags pt ON pt.tag_id = t.id
    WHERE pt.post_id = ?
    ORDER BY t.name ASC
  `;
  return db.prepare(sql).all(postId);
}

function findByName(name) {
  return db.prepare("SELECT * FROM tags WHERE name = ?").get(name);
}

function insert(name) {
  const existing = findByName(name);
  if (existing) return existing;

  const stmt = db.prepare("INSERT INTO tags (name) VALUES (?)");
  const result = stmt.run(name);
  return { id: result.lastInsertRowid, name };
}

function linkPostTag(postId, tagId) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO posts_tags (post_id, tag_id)
    VALUES (?, ?)
  `);
  stmt.run(postId, tagId);
}

function removeTagsForPost(postId) {
  db.prepare("DELETE FROM posts_tags WHERE post_id = ?").run(postId);
}

export default {
  getAll,
  getTagsForPost,
  findByName,
  insert,
  linkPostTag,
  removeTagsForPost,
};
