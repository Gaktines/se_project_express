const ClothingItem = require('../models/clothingItem');
const { ValidationError, NotFoundError } = require('../utils/errors');

const createItem = (req,res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL, owner, likes, createdAt } = req.body;

  ClothingItem.create({name, weather, imageURL, owner, likes, createdAt}).then((item) => {
    console.log(item);
    res.send({data: item})
  }).catch((e) => {
    if(e.name && e.name === 'NotFoundError'){
      const notFoundError = new NotFoundError();
      return res.status(notFoundError.statusCode).send({message:notFoundError.message});
      }
  })
};

const getItems = (req, res) => {
  console.log(req);
  ClothingItem.find({}).then((items) => res.status(200).send(items)).catch((e) => {
    if(e.name && e.name === 'ValidationError'){
      const validationError = new ValidationError();
      return res.status(validationError.statusCode).send({message:validationError.message});
      }
  })
};

const updateItem = (req,res) => {
  const {itemId} = req.params;
  const {imageURL} = req.body;

  ClothingItem.findByIdAndUpdate(itemId, {$set: {imageURL}}).orFail().then((item) => res.status(200).send({data:item})).catch((e) => {
    if(e.name && e.name === 'NotFoundError'){
      const notFoundError = new NotFoundError();
      return res.status(notFoundError.statusCode).send({message:notFoundErrormessage});
      }
});
};

const deleteItem = (req, res) => {
const {itemId} = req.params;
console.log(itemId);

ClothingItem.findByIdAndDelete(itemId).orFail().then((item) => res.status(204).send({}).catch((e) => {
  if(e.name && e.name === 'NotFoundError'){
    const notFoundError = new NotFoundError();
    return res.status(notFoundError.statusCode).send({message:notFoundError.message});
    }
}));
};

module.exports = {
  createItem, getItems, updateItem, deleteItem
}