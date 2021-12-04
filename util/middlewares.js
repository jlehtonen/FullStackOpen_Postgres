const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  return res.status(400).send({ error });
};

module.exports = { errorHandler };
