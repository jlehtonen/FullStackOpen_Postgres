const router = require("express").Router();

const { Op } = require("sequelize/dist");
const { User, Blog } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: { model: Blog, attributes: { exclude: ["userId"] } },
  });
  res.json(users);
});

router.get("/:id", async (req, res) => {
  let where = {};
  if (req.query.read !== undefined) {
    where = { isRead: req.query.read };
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
    include: [
      {
        model: Blog,
        as: "readings",
        through: { attributes: ["id", "isRead"], where },
        attributes: {
          exclude: ["userId", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  if (!user) {
    return res.status(404).end();
  }

  return res.send(user);
});

router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/:username", async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } });
  if (user) {
    user.name = req.body.name;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
