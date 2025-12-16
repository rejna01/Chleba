const express = require("express");
const app = express();
const path = require("path");
const fieldsRouter = require("./routes/fields");
const cors = require("cors");

app.use(cors());
// JSON body parser
app.use(express.json());

// Mount router
app.use("/api/fields", fieldsRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});
