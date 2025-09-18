const User = require("../models/user");
const ERROR_STATUS = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../utils/config");

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

const getCurrentUser = (req, res) => {
  const { userId } = req.user;
  User.findById(userId)
    .orFail(() => new Error("DocumentNotFoundError"))
    .then((user) => res.status(ERROR_STATUS.OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(ERROR_STATUS.BAD_REQUEST)
          .send({ message: err.message });
      }
      if (err.message === "DocumentNotFoundError") {
        return res
          .status(ERROR_STATUS.NOT_FOUND)
          .send({ message: "User not found" });
      }

      return res
        .status(ERROR_STATUS.INTERNAL_SERVER.code)
        .send({ message: ERROR_STATUS.INTERNAL_SERVER.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then(({ _id, name, avatar, email }) =>
      res.status(ERROR_STATUS.CREATED).send({ _id, name, avatar, email })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_STATUS.BAD_REQUEST)
          .send({ message: err.message });
      }
      if (err.code === 11000) {
        return res
          .status(ERROR_STATUS.CONFLICT)
          .send({ message: "This email is already in use" });
      }
      return res
        .status(ERROR_STATUS.INTERNAL_SERVER.code)
        .send({ message: ERROR_STATUS.INTERNAL_SERVER.message });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      res.status(ERROR_STATUS.UNAUTHORIZED).send({ message: err.message });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => new Error("DocumentNotFoundError"))
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_STATUS.BAD_REQUEST)
          .send({ message: err.message });
      }
      if (err.message === "DocumentNotFoundError") {
        return res
          .status(ERROR_STATUS.NOT_FOUND)
          .send({ message: "User not found" });
      }

      return res
        .status(ERROR_STATUS.INTERNAL_SERVER.code)
        .send({ message: ERROR_STATUS.INTERNAL_SERVER.message });
    });
};

module.exports = { getUsers, getCurrentUser, createUser, login, updateProfile };
