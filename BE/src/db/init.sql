CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title TEXT NOT NULL,
  picture TEXT,
  author_id INTEGER,
  created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT DEFAULT (CURRENT_TIMESTAMP),
  published_date TEXT DEFAULT (CURRENT_TIMESTAMP),
  category TEXT,
  lead TEXT,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS posts_tags (
  post_id INTEGER,
  tag_id INTEGER,
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE IF NOT EXISTS post_content (
  id INTEGER PRIMARY KEY,
  post_id INTEGER,
  type TEXT,
  value TEXT,
  help_value TEXT,
  order_index INTEGER
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  nickname TEXT,
  email TEXT,
  avatar TEXT,
  bio TEXT,
  created_at TEXT DEFAULT (CURRENT_TIMESTAMP)
);