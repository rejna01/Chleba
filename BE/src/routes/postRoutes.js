import express from "express";
import postService from "../services/postService.js";

const router = express.Router();

// GET /api/posts
router.get("/", async (req, res) => {
  try {
    const posts = await postService.getAll();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/posts/:id
router.get("/:id", async (req, res) => {
  try {
    const post = await postService.getById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
