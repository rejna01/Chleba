import { faker } from "@faker-js/faker"; // npm i @faker-js/faker better-sqlite3

import db from "../db/connection.js";

// --- Helper funkce ---
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Users ---
const insertUser = db.prepare(`
  INSERT INTO users (name, nickname, email, avatar, bio)
  VALUES (@name, @nickname, @email, @avatar, @bio)
`);

const users = Array.from({ length: 5 }).map(() => ({
  name: faker.person.fullName(),
  nickname: faker.internet.username(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  bio: faker.lorem.sentence(),
}));

db.transaction(() => {
  for (const user of users) insertUser.run(user);
})();

console.log("✅ Inserted users");

// --- Tags ---
const insertTag = db.prepare(`INSERT INTO tags (name) VALUES (?)`);
const tagNames = ["Tech", "AI", "Lifestyle", "Travel", "Finance", "Food", "Gaming", "Design"];
db.transaction(() => {
  for (const tag of tagNames) insertTag.run(tag);
})();
console.log("✅ Inserted tags");

// --- Posts ---
const insertPost = db.prepare(`
  INSERT INTO posts (slug, title, picture, author_id, category, lead)
  VALUES (@slug, @title, @picture, @author_id, @category, @lead)
`);

const postCount = 10;
const categories = ["Technology", "Culture", "Science", "Business"];

const posts = Array.from({ length: postCount }).map(() => ({
  slug: faker.lorem.slug(),
  title: faker.lorem.sentence(5),
  picture: faker.image.urlLoremFlickr({ category: "nature" }),
  author_id: randomInt(1, users.length),
  category: faker.helpers.arrayElement(categories),
  lead: faker.lorem.paragraph(),
}));

db.transaction(() => {
  for (const post of posts) insertPost.run(post);
})();
console.log("✅ Inserted posts");

// --- Post Tags ---
const insertPostTag = db.prepare(`
  INSERT INTO posts_tags (post_id, tag_id) VALUES (?, ?)
`);

db.transaction(() => {
  for (let postId = 1; postId <= postCount; postId++) {
    const tagCount = randomInt(1, 3);
    const tagIds = faker.helpers.arrayElements(
      Array.from({ length: tagNames.length }, (_, i) => i + 1),
      tagCount
    );
    for (const tagId of tagIds) insertPostTag.run(postId, tagId);
  }
})();
console.log("✅ Linked posts with tags");

// --- Post Content ---
const insertContent = db.prepare(`
  INSERT INTO post_content (post_id, type, value, help_value, order_index)
  VALUES (@post_id, @type, @value, @help_value, @order_index)
`);

const contentTypes = ["paragraph", "image", "quote", "subheading"];

db.transaction(() => {
  for (let postId = 1; postId <= postCount; postId++) {
    const blockCount = randomInt(2, 5);
    for (let i = 0; i < blockCount; i++) {
      const type = faker.helpers.arrayElement(contentTypes);
      insertContent.run({
        post_id: postId,
        type,
        value:
          type === "image"
            ? faker.image.urlLoremFlickr({ category: "abstract" })
            : faker.lorem.paragraph(),
        help_value: type === "quote" ? faker.person.fullName() : null,
        order_index: i + 1,
      });
    }
  }
})();
console.log("✅ Inserted post content");

console.log("🎉 Database seeding complete!");
