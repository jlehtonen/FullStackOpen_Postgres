require("dotenv").config();
const { connectToDatabase } = require("./util/db");
const { Blog } = require("./models");

const main = async () => {
  await connectToDatabase();
  const blogs = await Blog.findAll();
  blogs.forEach((blog) => {
    console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
  });
};

main();
