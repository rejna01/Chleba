import postDao from "../dao/postDao.js";
import tagDao from "../dao/tagDao.js";
import postContentDao from "../dao/postContentDao.js";

async function getAll() {
  const posts = postDao.getAll();
  for (const post of posts) {
    post.tags = tagDao.getTagsForPost(post.id);
  }
  return posts;
}

async function getById(id) {
  const post = postDao.getById(id);
  if (!post) return null;
  post.tags = tagDao.getTagsForPost(id);
  post.content = postContentDao.getForPost(id);
  return post;
}

export default { getAll, getById };
