import postDao from "../dao/postDao.js";
import tagDao from "../dao/tagDao.js";
import postContentDao from "../dao/postContentDao.js";
import userDao from "../dao/userDao.js";

async function getAll() {
  const posts = postDao.getAll();
  for (const post of posts) {
    post.tags = tagDao.getTagsForPost(post.id);
    post.author = userDao.getUserByIdForPost(post.author_id);
  }
  return posts;
}

async function getList(params) {
  //validate(params);
  const posts = postDao.list(params);
  for (const post of posts) {
    post.tags = tagDao.getTagsForPost(post.id);
    post.author = userDao.getUserByIdForPost(post.author_id);
  }
  return posts;
}

async function getById(id) {
  const post = postDao.getById(id);
  if (!post) return null;
  post.tags = tagDao.getTagsForPost(id);
  post.content = postContentDao.getForPost(id);
  post.author = userDao.getUserByIdForPost(post.author_id);
  return post;
}

export default { getAll, getById, getList };
