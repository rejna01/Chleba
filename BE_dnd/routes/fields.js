const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../db/db");
const fs = require("fs");

// Načtení layoutu jen při startu
const layoutPath = path.join(__dirname, "../layouts/characterSheet.json");
const layout = JSON.parse(fs.readFileSync(layoutPath, "utf8"));

// Pomocná mapa pro rychlou validaci
const validFieldIds = new Set(layout.fields.map((f) => f.id));

/**
 * GET /fields/:id
 * Vrací layout obohacený o hodnoty z DB
 */
router.get("/:id", (req, res) => {
  const entityId = req.params.id;

  // Načteme všechny field values pro tuto postavu
  const rows = db
    .prepare("SELECT field_name, value FROM fields WHERE entity_id = ?")
    .all(entityId);

  // Mapujeme field_name → value
  const valuesMap = {};
  rows.forEach((r) => {
    valuesMap[r.field_name] = r.value;
  });

  // Vytvoříme výstup
  const result = {
    ...layout, // viewBox a případně jiné info z layoutu
    id: entityId, // přepíše id layoutu na id entity
    fields: layout.fields.map((f) => ({
      ...f,
      value: valuesMap[f.id] || "",
    })),
  };

  res.json(result);
});

/**
 * PUT /fields
 * Uloží nebo aktualizuje jednu hodnotu
 * Body: { id: "char_001", nameOfField: "strength", value: 16 }
 */
router.put("/", (req, res) => {
  const { id, nameOfField, value } = req.body;

  if (!id || !nameOfField) {
    return res.status(400).json({ error: "id a nameOfField jsou povinné" });
  }

  // Validace proti layoutu
  if (!validFieldIds.has(nameOfField)) {
    return res.status(400).json({ error: "Neznámý field_name" });
  }

  // INSERT OR REPLACE
  db.prepare(
    "INSERT OR REPLACE INTO fields (entity_id, field_name, value) VALUES (?, ?, CAST(? AS INTEGER))"
  ).run(id, nameOfField, value);

  res.json({ success: true });
});

module.exports = router;
