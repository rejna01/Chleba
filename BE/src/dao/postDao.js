import db from "../db/connection.js";

function getAll() {
  return db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
}

function list({ limit, page, sortBy, sortDir, filterBy, filterText }) {
  let sql = `SELECT * FROM posts`;
  const params = {};

  if (filterBy && filterText) {
    sql += ` WHERE ${filterBy} LIKE :filterText`;
    params.filterText = `%${filterText}%`;
  }

  sql += ` ORDER BY ${sortBy} ${sortDir === 'desc' ? 'DESC' : 'ASC'}`;
  sql += ` LIMIT :limit OFFSET :offset`;
  params.limit = limit;
  params.offset = (page - 1) * limit;

  return db.prepare(sql).all(params);
}

function getById(id) {
  return db.prepare("SELECT * FROM posts WHERE id = ?").get(id);
}

export default { getAll, getById, list };
