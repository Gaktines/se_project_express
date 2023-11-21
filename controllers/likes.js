const ClothingItem = require("../models/clothingItem");
const { ValidationError } = require("../utils/errors/ValidationError");
const { CastError } = require("../utils/errors/CastError");
const { NotFoundError } = require("../utils/errors/NotFoundError");

module.exports.likeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  )

    .orFail(() => new NotFoundError())
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      console.error(e);
      if (e.name && e.name === "CastError") {
        next(new CastError("Error in likeItem"));
      } else if (e.name && e.name === "ValidationError") {
        next(new ValidationError("Error in likeItem"));
      } else if (e.name && e.name === "NotFoundError") {
        next(new NotFoundError("Error in likeItem"));
      } else {
        next(e);
      }
    });

module.exports.dislikeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .orFail(() => new NotFoundError())
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      console.error(e);
      if (e.name && e.name === "CastError") {
        next(new CastError("Error in likeItem"));
      } else if (e.name && e.name === "ValidationError") {
        next(new ValidationError("Error in likeItem"));
      } else if (e.name && e.name === "NotFoundError") {
        next(new NotFoundError("Error in likeItem"));
      } else {
        next(e);
      }
    });
