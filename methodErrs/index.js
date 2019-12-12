exports.methodError = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};
