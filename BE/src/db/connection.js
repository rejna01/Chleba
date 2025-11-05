import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath = path.resolve("./data/database.db");
const initPath = path.resolve("./src/db/init.sql");

const dbExists = fs.existsSync(dbPath);
const db = new Database(dbPath);

if (!dbExists) {
  const initSQL = fs.readFileSync(initPath, "utf-8");
  db.exec(initSQL);
  console.log("✅ Database initialized.");
}

export default db;
