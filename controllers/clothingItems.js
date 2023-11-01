const ClothingItem = require("../models/clothingItem");
const { ValidationError } = require("../utils/errors/ValidationError");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { CastError } = require("../utils/errors/CastError");
const { ServerError } = require("../utils/errors/ServerError");
const { ForbiddenError } = require("../utils/errors/ForbiddenError");
const { ErrorHandler } = require("../middlewares/errorHandler");

const createItem = (req, res) => {
  // console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  console.log(imageUrl);

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      console.log(req.user._id);
      res.send({ data: item });
    })
    .catch(next);
};

const getItems = (req, res) => {
  console.log(req);
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(next);
};

const deleteItem = (req, res) => {
  const itemId  = req.params.itemId;

  console.log(itemId);

  ClothingItem.findById(itemId)
    .orFail(() => new NotFoundError())
    .then((item) => {
      console.log(item);
      if (!item.owner.equals(req.user._id)) {
        const forbiddenError = new ForbiddenError();
        return res
          .status(forbiddenError.statusCode)
          .send({ message: forbiddenError.message });
      }
      console.log(itemId);
      return ClothingItem.findByIdAndDelete(itemId)
        .orFail(() => new NotFoundError())
        .then(() => res.status(200).send({ message: "item deleted" }))
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
};
