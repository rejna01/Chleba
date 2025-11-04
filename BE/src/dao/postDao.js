import db from "../db/connection.js";

function getAll() {
  return db.prepare("SELECT * FROM posts ORDER BY date DESC").all();
}

function getById(id) {
  return db.prepare("SELECT * FROM posts WHERE id = ?").get(id);
}

export default { getAll, getById };
