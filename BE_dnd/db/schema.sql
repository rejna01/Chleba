CREATE TABLE IF NOT EXISTS fields (
  entity_id TEXT NOT NULL,
  field_name TEXT NOT NULL,
  value TEXT,
  PRIMARY KEY (entity_id, field_name)
);