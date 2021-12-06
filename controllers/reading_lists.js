const router = require("express").Router();

const User = require("../models/user");
const Blog = require("../models/blog");
const ReadingList = require("../models/reading_list");
const { tokenExtractor } = require("../util/middlewares");

router.post("/", async (req, res) => {
  const user = await User.findByPk(req.body.user_id);
  const blog = await Blog.findByPk(req.body.blog_id);
  if (!user || !blog) {
    return res.status(404).send({ error: "no such user or blog" });
  }

  readingList = await ReadingList.create({ userId: user.id, blogId: blog.id });
  return res.send(readingList);
});

router.put("/:id", tokenExtractor, async (req, res) => {
  const readingListEntry = await ReadingList.findByPk(req.params.id);
  if (!readingListEntry) {
    return res.status(404).end();
  }

  if (req.decodedToken.id !== readingListEntry.userId) {
    return res.status(403).send({
      error: "entries on other users' reading lists cannot be edited",
    });
  }

  readingListEntry.isRead = req.body.read;
  await readingListEntry.save();
  return res.send(readingListEntry);
});

module.exports = router;
