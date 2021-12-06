const jwt = require("jsonwebtoken");
const { User, Session } = require("../models");
const { SECRET } = require("./config");

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "SequelizeValidationError") {
    return res.status(400).send({ error: error.errors.map((e) => e.message) });
  }

  return res.status(400).send({ error });
};

const extractUser = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "token missing" });
  }
  let token = null;
  let decodedToken = null;
  try {
    token = authorization.substring(7);
    console.log(token);
    decodedToken = jwt.verify(token, SECRET);
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "token invalid" });
  }
  const session = await Session.findOne({ where: { userId: decodedToken.id } });
  if (!session || session.token !== token) {
    return res.status(401).json({ error: "token invalid" });
  }

  const user = await User.findByPk(decodedToken.id);
  if (!user) {
    return res.status(401).json({ error: "token invalid" });
  }
  req.user = user;
  next();
};

const requireEnabledUser = (req, res, next) => {
  if (req.user.isDisabled) {
    return res.status(403).json({ error: "user is disabled" });
  }
  next();
};

module.exports = { errorHandler, extractUser, requireEnabledUser };
