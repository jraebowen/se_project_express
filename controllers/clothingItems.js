const Item = require("../models/clothingItem");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Internal server error" });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl, owner } = req.body;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ item }))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Internal server error" });
    });
};

const deleteItem = (req, res) => {
  Item.findByIdAndDelete(req.params.id)
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Internal server error" });
    });
};

module.exports = { getItems, createItem, deleteItem };
