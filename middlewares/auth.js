const ERROR_STATUS = require("../utils/errors");
const jwt = require("jsonwebtoken");

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(ERROR_STATUS.UNAUTHORIZED)
      .send({ message: "Authorization required" });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(ERROR_STATUS.UNAUTHORIZED)
      .send({ message: "Authorization required" });
  }
  req.user = payload;
  next();
};
