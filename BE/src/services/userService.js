import userDao from "../dao/userDao.js";

async function getAll() {
  const users = userDao.getAll();
  return users;
}

/*async function getList(params) {
  //validate(params);
  const posts = postDao.list(params);
  for (const post of posts) {
    post.tags = tagDao.getTagsForPost(post.id);
    post.author = userDao.getUserByIdForPost(post.author_id);
  }
  return posts;
}*/

async function getById(id) {
  const user = userDao.getUserById(id);
  if (!user) return null;
  return user;
}

export default { getAll, getById };
