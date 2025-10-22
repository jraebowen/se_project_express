const ClothingItem = require("../models/clothingItem");
const ERROR_STATUS = require("../utils/errors");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");
const ForbiddenError = require("../errors/forbidden-error");

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(ERROR_STATUS.OK).send(items))
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(ERROR_STATUS.CREATED).json(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Item could not be created"));
      } else {
        return next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      if (userId.toString() !== item.owner.toString()) {
        throw new ForbiddenError("Action not authorized");
      }
      return ClothingItem.findByIdAndDelete(itemId)
        .then(() => {
          res.send({ message: "Item deleted successfully" });
        })
        .catch((err) => {
          if (err.name === "CastError") {
            return next(new BadRequestError("Invalid id"));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid id"));
      } else {
        return next(err);
      }
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      return res.status(ERROR_STATUS.OK).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid id"));
      } else {
        return next(err);
      }
    });
};

const unlikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      return res.status(ERROR_STATUS.OK).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid id"));
      } else {
        return next(err);
      }
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
