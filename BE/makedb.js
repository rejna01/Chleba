const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

/**
 * Create or open a better-sqlite3 database and ensure basic schema / pragmas.
 * @param {string} dbPath - file path for the sqlite database
 * @param {object} [opts]
 * @param {boolean} [opts.verbose] - if true, enable verbose logging from better-sqlite3
 * @returns {Database} opened better-sqlite3 Database instance
 */
function makeDb(dbPath = "./data.sqlite", opts = {}) {
  const dir = path.dirname(dbPath);
  if (dir && dir !== ".") fs.mkdirSync(dir, { recursive: true });

  const db = new Database(dbPath, {
    verbose: opts.verbose ? console.log : undefined,
  });

  // Recommended pragmas
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // Wrap schema creation in a transaction
  db.exec("BEGIN");
  try {
    db.exec(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INTEGER PRIMARY KEY,
                name TEXT UNIQUE NOT NULL,
                applied_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
            );

            CREATE TABLE IF NOT EXISTS kv (
                key TEXT PRIMARY KEY,
                value BLOB
            );

            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
            );
        `);
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }

  return db;
}

module.exports = makeDb;
