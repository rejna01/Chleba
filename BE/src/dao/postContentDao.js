import db from "../db/connection.js";

function getForPost(postId) {
  const sql = `
    SELECT id, type, value, help_value, order_index
    FROM post_content
    WHERE post_id = ?
    ORDER BY order_index ASC
  `;
  return db.prepare(sql).all(postId);
}

function insert(postId, type, value, helpValue = null, orderIndex = null) {
  const stmt = db.prepare(`
    INSERT INTO post_content (post_id, type, value, help_value, order_index)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(postId, type, value, helpValue, orderIndex);
  return {
    id: result.lastInsertRowid,
    post_id: postId,
    type,
    value,
    help_value: helpValue,
    order_index: orderIndex,
  };
}

/**
 * Odstraní všechny content bloky pro daný post
 * @param {number} postId
 */
function removeForPost(postId) {
  db.prepare("DELETE FROM post_content WHERE post_id = ?").run(postId);
}

function update(id, data) {
  const { type, value, help_value, order_index } = data;
  db.prepare(
    `
    UPDATE post_content
    SET type = ?, value = ?, help_value = ?, order_index = ?
    WHERE id = ?
  `
  ).run(type, value, help_value, order_index, id);
}

function removeById(id) {
  db.prepare("DELETE FROM post_content WHERE id = ?").run(id);
}

export default {
  getForPost,
  insert,
  update,
  removeById,
  removeForPost,
};
