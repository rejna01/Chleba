const Database = require("better-sqlite3");

const db = new Database("foobar.db", { verbose: console.log });

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    created DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`
).run();
