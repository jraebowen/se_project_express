const User = require("../models/user");
const ERROR_STATUS = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(ERROR_STATUS.OK).send(users))
    .catch((err) => {
      console.error(err);
      res
        .status(ERROR_STATUS.INTERNAL_SERVER.code)
        .send({ message: ERROR_STATUS.INTERNAL_SERVER.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      return res.status(ERROR_STATUS.OK).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(ERROR_STATUS.BAD_REQUEST)
          .send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_STATUS.NOT_FOUND)
          .send({ message: err.message });
      }

      return res
        .status(ERROR_STATUS.INTERNAL_SERVER.code)
        .send({ message: ERROR_STATUS.INTERNAL_SERVER.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(ERROR_STATUS.CREATED).send({ user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_STATUS.BAD_REQUEST)
          .send({ message: err.message });
      }
      return res
        .status(ERROR_STATUS.INTERNAL_SERVER.code)
        .send({ message: ERROR_STATUS.INTERNAL_SERVER.message });
    });
};

module.exports = { getUsers, getUser, createUser };
