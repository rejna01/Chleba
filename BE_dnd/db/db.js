const Database = require("better-sqlite3");
const path = require("path");

// cesta k SQLite souboru
const dbFile = path.resolve("./data/database.db");

// otevře DB (vytvoří, pokud neexistuje)
const db = new Database(dbFile);

// Inicializace tabulky fields, pokud neexistuje
db.exec(`
  CREATE TABLE IF NOT EXISTS fields (
    entity_id TEXT NOT NULL,
    field_name TEXT NOT NULL,
    value TEXT,
    PRIMARY KEY (entity_id, field_name)
  );
`);

// exportujeme instanci DB pro použití v routes
module.exports = db;
