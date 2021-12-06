const router = require("express").Router();

const { Blog, User, ReadingList } = require("../models");

const { Op } = require("sequelize/dist");
const { extractUser, requireEnabledUser } = require("../util/middlewares");

router.get("/", async (req, res) => {
  let where = {};
  if (req.query.search) {
    where = {
      [Op.or]: {
        title: { [Op.iLike]: `%${req.query.search}%` },
        author: { [Op.iLike]: `%${req.query.search}%` },
      },
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: { model: User, attributes: ["name"] },
    where,
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

router.post("/", extractUser, requireEnabledUser, async (req, res) => {
  const blog = await Blog.create({ ...req.body, userId: req.user.id });
  res.json(blog);
});

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.delete(
  "/:id",
  blogFinder,
  extractUser,
  requireEnabledUser,
  async (req, res) => {
    if (req.blog) {
      if (req.user.id !== req.blog.userId) {
        return res
          .status(403)
          .send({ error: "cannot delete other users' blogs" });
      }
      await ReadingList.destroy({ where: { blogId: req.blog.id } });
      await req.blog.destroy();
    }

    res.status(204).end();
  }
);

router.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = Number(req.body.likes);
    await req.blog.save();
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
