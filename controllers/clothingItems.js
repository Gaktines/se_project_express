const ClothingItem = require("../models/clothingItem");
const { ValidationError } = require("../utils/errors/ValidationError");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { CastError } = require("../utils/errors/CastError");
const { ServerError } = require("../utils/errors/ServerError");

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
      console.log(e);
      if (e.name === "ServerError") {
        const serverError = new ServerError();
        return res
          .status(serverError.statusCode)
          .send({ message: serverError.message });
      }
      if (e.name === "ValidationError") {
        const validationError = new ValidationError();
        return res
          .status(validationError.statusCode)
          .send({ message: validationError.message });
      }

        console.log("NotFoundError");
        const notFoundError = new NotFoundError();
        return res
          .status(notFoundError.statusCode)
          .send({ message: notFoundError.message });
      });

    };


const getItems = (req, res) => {
  console.log(req);
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      console.log(e);
      const serverError = new ServerError();
      return res
        .status(serverError.statusCode)
        .send({ message: serverError.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);

  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      const notFoundError = new NotFoundError();
      return res
        .status(notFoundError.statusCode)
        .send({ message: notFoundError.message });
    })
    .then(() =>
      res
        .status(200)
        .send({ message: "item deleted" })
        .catch((e) => {
          if (e.name === "ServerError") {
            const serverError = new ServerError();
            return res
              .status(serverError.statusCode)
              .send({ message: serverError.message });
          }
          if (e.name && e.name === "NotFoundError") {
            const notFoundError = new NotFoundError();
            return res
              .status(notFoundError.statusCode)
              .send({ message: notFoundError.message });
          }
            const castError = new CastError();
            return res
              .status(castError.statusCode)
              .send({ message: castError.message });
        }),
    );
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
};

module.exports.createClothingItem = (req) => {
  console.log(req.user._id); // _id will become accessible
};
