const ClothingItem = require("../models/clothingItem");
const { ValidationError } = require("../utils/errors/ValidationError");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { CastError } = require("../utils/errors/CastError");
const { BadRequestError } = require("../utils/errors/BadRequestError");
const { ForbiddenError } = require("../utils/errors/ForbiddenError");

const createItem = (req, res, next) => {
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
    .catch((e) => {
      console.log(e);
      if (e.name === "ValidationError") {
        next(new ValidationError("Error in createItem"));
      } else {
        next(e);
      }
    });
};

const getItems = (req, res, next) => {
  console.log(req);
  ClothingItem.find({})
    .then((items) => res.status(201).send(items))
    .catch((e) => {
      console.log(e);
      if (res.status !== 201) {
        next(new BadRequestError("Error in getItems"));
      } else {
        next(e);
      }
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  console.log(itemId);
  ClothingItem.findById(itemId)
    .orFail(() => new NotFoundError())
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        const forbiddenError = new ForbiddenError();
        return res
          .status(forbiddenError.statusCode)
          .send({ message: forbiddenError.message })
          .catch((e) => {
            if (e.name === "CastError") {
              next(new CastError("Error in deleteItem"));
            } else {
              next(e);
          }});
      }
      return ClothingItem.findByIdAndDelete(itemId)
        .orFail(() => new NotFoundError())
        .then(() => res.status(200).send({ message: "item deleted" }))
        .catch((e) => {
          if (e.name === "CastError") {
            next(new CastError("Error in deleteItem"));
          } else {
            next(e);
          }
        });
    });
};
module.exports = {
  createItem,
  getItems,
  deleteItem,
};
