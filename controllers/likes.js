const ClothingItem = require("../models/clothingItem");
const { ValidationError } = require("../utils/errors");

module.exports.likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      console.log(e);
      if (e.name && e.name === "ValidationError") {
        const validationError = new ValidationError();
        return res
          .status(validationError.statusCode)
          .send({message:validationError.message});
      }
    });

module.exports.dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      console.log(e);
      if (e.name && e.name === "ValidationError") {
        const validationError = new ValidationError();
        return res
          .status(validationError.statusCode)
          .send({message:validationError.message});
      }
    });
