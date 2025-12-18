const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("../db/db");

// Nastavení Multeru – memory storage
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Pouze obrázky"));
    }
    cb(null, true);
  },
});

const UPLOAD_ROOT = path.join(__dirname, "../uploads/images");

// Pomocná funkce pro složku
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// ===== POST /image =====
router.post("/image", upload.single("image"), async (req, res) => {
  try {
    const { id, nameOfField } = req.body;
    const file = req.file;

    if (!id || !nameOfField || !file) {
      return res.status(400).json({ error: "Chybí data" });
    }

    const entityDir = path.join(UPLOAD_ROOT, id);
    ensureDir(entityDir);

    const ext = path.extname(file.originalname);
    const fileName = `${nameOfField}${ext}`;
    const filePath = path.join(entityDir, fileName);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    fs.writeFileSync(filePath, file.buffer);

    const publicUrl = `/uploads/images/${id}/${fileName}`;

    db.prepare(
      "INSERT OR REPLACE INTO fields (entity_id, field_name, value) VALUES (?, ?, ?)"
    ).run(id, nameOfField, publicUrl);

    res.json({ url: publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chyba při uploadu obrázku" });
  }
});

// ===== PUT / =====
router.put("/", (req, res) => {
  try {
    const { id, nameOfField } = req.body;
    if (!id || !nameOfField)
      return res.status(400).json({ error: "Chybí data" });

    const row = db
      .prepare(
        "SELECT value FROM fields WHERE entity_id = ? AND field_name = ?"
      )
      .get(id, nameOfField);

    if (row?.value) {
      const filePath = path.join(
        __dirname,
        "..",
        row.value.replace("/uploads/", "uploads/")
      );
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    db.prepare(
      "UPDATE fields SET value = '' WHERE entity_id = ? AND field_name = ?"
    ).run(id, nameOfField);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chyba při mazání obrázku" });
  }
});

module.exports = router;
