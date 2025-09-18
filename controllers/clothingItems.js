const ClothingItem = require("../models/clothingItem");
const ERROR_STATUS = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(ERROR_STATUS.OK).send(items))
    .catch((err) => {
      console.error(err);
      res
        .status(ERROR_STATUS.INTERNAL_SERVER.code)
        .send({ message: ERROR_STATUS.INTERNAL_SERVER.message });
    });
};

const createItem = (req, res) => {
  console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(ERROR_STATUS.CREATED).json(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_STATUS.BAD_REQUEST)
          .json({ message: err.message });
      }
      return res
        .status(ERROR_STATUS.INTERNAL_SERVER.code)
        .send({ message: ERROR_STATUS.INTERNAL_SERVER.message });
    });
};

const deleteItem = (req, res) => {
  const itemId = req.params.itemID;
  const userId = req.user._id;
  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res
          .status(ERROR_STATUS.NOT_FOUND)
          .send({ message: "Item not found" });
      }
      if (userId.toString() !== item.owner.toString()) {
        return res
          .status(ERROR_STATUS.FORBIDDEN)
          .send({ message: "Action not authorized" });
      }
      return ClothingItem.findByIdAndDelete(itemId)
        .then(() => {
          res.send({ message: "Item deleted successfully" });
        })
        .catch((err) => {
          console.error(err);
          if (err.name === "CastError") {
            return res
              .status(ERROR_STATUS.BAD_REQUEST)
              .send({ message: "Invalid id" });
          }
          return res
            .status(ERROR_STATUS.INTERNAL_SERVER.code)
            .send({ message: ERROR_STATUS.INTERNAL_SERVER.message });
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(ERROR_STATUS.BAD_REQUEST)
          .send({ message: "Invalid id" });
      }
      return res
        .status(ERROR_STATUS.INTERNAL_SERVER.code)
        .send({ message: ERROR_STATUS.INTERNAL_SERVER.message });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(ERROR_STATUS.NOT_FOUND)
          .send({ message: "Item not found" });
      }
      return res.status(ERROR_STATUS.OK).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(ERROR_STATUS.BAD_REQUEST)
          .send({ message: err.message });
      }
      return res
        .status(ERROR_STATUS.INTERNAL_SERVER.code)
        .send({ message: ERROR_STATUS.INTERNAL_SERVER.message });
    });
};

const unlikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(ERROR_STATUS.NOT_FOUND)
          .send({ message: "Item not found" });
      }
      return res.status(ERROR_STATUS.OK).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(ERROR_STATUS.BAD_REQUEST)
          .send({ message: "Invalid id" });
      }
      return res
        .status(ERROR_STATUS.INTERNAL_SERVER.code)
        .send({ message: ERROR_STATUS.INTERNAL_SERVER.message });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
