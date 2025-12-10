import express from "express";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

export default app;
