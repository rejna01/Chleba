const express = require("express");
const Database = require("better-sqlite3");
const port = 5000;

const app = express();
const db = new Database("data.db");

// Middleware to parse incoming JSON
app.use(express.json());

// Create tables if they don't exist
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    created DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`
).run();

// Recommended pragmas
db.pragma("foreign_keys = ON");

// Vytvoření tabulek (jednou při inicializaci)
db.exec(`
  CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    author TEXT,
    published_date TEXT,
    category TEXT,
    picture TEXT,
    lead TEXT,
    content TEXT
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
  );

  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS stories_tags (
    stories_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    FOREIGN KEY (stories_id) REFERENCES stories(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE(stories_id, tag_id)
  );
`);
// === NOTES ROUTES ===

// Get all notes
app.get("/api/notes", (req, res) => {
  const notes = db
    .prepare("SELECT * FROM notes ORDER BY created ASC LIMIT 10")
    .all();
  res.json(notes);
});

// Get a single note
app.get("/api/notes/:id", (req, res) => {
  const note = db
    .prepare("SELECT * FROM notes WHERE id = ?")
    .get(req.params.id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).json({ error: "Note not found" });
  }
});

// Add a new note
app.post("/api/notes", (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const stmt = db.prepare("INSERT INTO notes (text) VALUES (?)");
  const info = stmt.run(text);
  res.json({ id: info.lastInsertRowid });
});

// Delete a note
app.delete("/api/notes/:id", (req, res) => {
  const info = db.prepare("DELETE FROM notes WHERE id = ?").run(req.params.id);
  if (info.changes > 0) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Note not found" });
  }
});

// === STORIES ROUTES ===

// Get all stories (overview)
app.get("/api/stories", (req, res) => {
  // determine page (supports both ?page=2 and ?page2)
  let page = 1;
  if (req.query.page) {
    page = parseInt(req.query.page, 10) || 1;
  } else {
    const pageKey = Object.keys(req.query).find((k) => /^page\d+$/.test(k));
    if (pageKey) {
      page = parseInt(pageKey.replace(/^page/, ""), 10) || 1;
    }
  }

  if (page < 1) page = 1;

  const limit = 10;
  const offset = (page - 1) * limit;

  const stories = db
    .prepare(
      "SELECT id, picture, slug, title, lead, tags FROM stories ORDER BY created DESC LIMIT ? OFFSET ?"
    )
    .all(limit, offset);

  res.json(stories);
});

// Get a single post
app.get("/api/stories/:id", (req, res) => {
  const post = db
    .prepare("SELECT * FROM stories WHERE id = ?")
    .get(req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: "Story not found" });
  }
});

// Add a new post
app.post("/api/stories", (req, res) => {
  const {
    title,
    picture,
    slug,
    author,
    published_date,
    category,
    tags,
    lead,
    content,
  } = req.body;

  // Basic required fields check
  if (!title || !slug) {
    return res.status(400).json({ error: "Title and slug are required" });
  }

  const stmt = db.prepare(`
    INSERT INTO stories (
      title, picture, slug, author, published_date,
      category, tags, lead, content
    ) VALUES (
      @title, @picture, @slug, @author,
      @published_date, @category, @tags, @lead, @content
    )
  `);

  const info = stmt.run({
    title,
    picture,
    slug,
    author,
    published_date,
    category,
    tags,
    lead,
    content,
  });

  res.json({ id: info.lastInsertRowid });
});

// Delete a post
app.delete("/api/stories/:id", (req, res) => {
  const info = db
    .prepare("DELETE FROM stories WHERE id = ?")
    .run(req.params.id);
  if (info.changes > 0) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Stories not found" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
