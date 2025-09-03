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
    .then((item) => res.status(ERROR_STATUS.CREATED).json({ item }))
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
  ClothingItem.findByIdAndDelete(req.params.id)
    .then((item) => res.status(ERROR_STATUS.OK).send({ data: item }))
    .catch((err) => {
      console.error(err);
      res
        .status(ERROR_STATUS.INTERNAL_SERVER.code)
        .send({ message: ERROR_STATUS.INTERNAL_SERVER.message });
    });
};

module.exports = { getItems, createItem, deleteItem };
