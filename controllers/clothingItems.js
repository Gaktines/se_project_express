const ClothingItem = require("../models/clothingItem");
const { ValidationError } = require("../utils/errors/ValidationError");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { CastError } = require("../utils/errors/CastError");
const { ServerError } = require("../utils/errors/ServerError");
const { ForbiddenError } = require("../utils/errors/ForbiddenError");

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
    .catch((e) => {
      console.error(e);
      if (e.name === "ValidationError") {
        const validationError = new ValidationError();
        return res
          .status(validationError.statusCode)
          .send({ message: validationError.message });
      }
      const serverError = new ServerError();
      return res
        .status(serverError.statusCode)
        .send({ message: serverError.message });
    });
};

const getItems = (req, res) => {
  console.log(req);
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      console.error(e);
      const serverError = new ServerError();
      return res
        .status(serverError.statusCode)
        .send({ message: serverError.message });
    });
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
        .catch((e) => {
          console.error(e);
          if (e.name === "CastError") {
            const castError = new CastError();
            return res
              .status(castError.statusCode)
              .send({ message: castError.message });
          }
          if (e.name && e.name === "NotFoundError") {
            const notFoundError = new NotFoundError();
            return res
              .status(notFoundError.statusCode)
              .send({ message: notFoundError.message });
          }
          const serverError = new ServerError();
          return res
            .status(serverError.statusCode)
            .send({ message: serverError.message });
        });
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "CastError") {
        const castError = new CastError();
        return res
          .status(castError.statusCode)
          .send({ message: castError.message });
      }
      if (e.name && e.name === "NotFoundError") {
        const notFoundError = new NotFoundError();
        return res
          .status(notFoundError.statusCode)
          .send({ message: notFoundError.message });
      }
      const serverError = new ServerError();
      return res
        .status(serverError.statusCode)
        .send({ message: serverError.message });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
};
