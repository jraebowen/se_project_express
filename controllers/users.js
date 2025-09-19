const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const ERROR_STATUS = require("../utils/errors");

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => new Error("DocumentNotFoundError"))
    .then((user) => res.status(ERROR_STATUS.OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(ERROR_STATUS.BAD_REQUEST)
          .send({ message: "Invalid data" });
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
    .then((user) => {
      const {
        _id,
        name: userName,
        avatar: userAvatar,
        email: userEmail,
      } = user;
      res.status(ERROR_STATUS.CREATED).send({
        _id,
        name: userName,
        avatar: userAvatar,
        email: userEmail,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_STATUS.BAD_REQUEST)
          .send({ message: "Invalid data" });
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
  if (!email || !password) {
    return res
      .status(ERROR_STATUS.BAD_REQUEST)
      .send({ message: "Please enter valid email and password" });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(ERROR_STATUS.UNAUTHORIZED)
          .send({ message: "Incorrect email or password" });
      }
      return res
        .status(ERROR_STATUS.INTERNAL_SERVER.code)
        .send({ message: ERROR_STATUS.INTERNAL_SERVER.message });
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
          .send({ message: "Invalid data" });
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

module.exports = { getCurrentUser, createUser, login, updateProfile };
