const express = require("express");
const path = require("path");

const fieldsRouter = require("./routes/fields");
const fileUploadRouter = require("./routes/filesUpload");

const app = express();

// ===== middleware =====
app.use(express.json());

// ⚠️ multer si řeší multipart sám, NEDÁVAT express.urlencoded pro upload
app.use(express.urlencoded({ extended: false }));

// ===== API routes =====
app.use("/api/fields", fieldsRouter);
app.use("/api/fileUpload", fileUploadRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== error handler (multer atd.) =====
app.use((err, req, res, next) => {
  if (err.message?.includes("Pouze obrázky")) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Interní chyba serveru" });
});

// ===== start =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});
