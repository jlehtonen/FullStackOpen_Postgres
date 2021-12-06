const router = require("express").Router();

const Session = require("../models/session");
const { extractUser } = require("../util/middlewares");

router.delete("/", extractUser, async (req, res) => {
  await Session.destroy({ where: { userId: req.user.id } });
  return res.status(204).end();
});

module.exports = router;
