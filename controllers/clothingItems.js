const ClothingItem = require('../models/clothingItem');

const createItem = (req,res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL, owner, likes, createdAt } = req.body;

  ClothingItem.create({name, weather, imageURL, owner, likes, createdAt}).then((item) => {
    console.log(item);
    res.send({data: item})
  }).catch((e) => {
    res.status(500).send({message: 'createItem Error',e});
  })
};

const getItems = (req, res) => {
  console.log(req);
  ClothingItem.find({}).then((items) => res.status(200).send(items)).catch((e) => {
    res.status(500).send({message: "getItems Error", e});
  })
};

const updateItem = (req,res) => {
  const {itemId} = req.params;
  const {imageURL} = req.body;

  ClothingItem.findByIdAndUpdate(itemId, {$set: {imageURL}}).orFail().then((item) => res.status(200).send({data:item})).catch((e) => {
    res.status(500).send({message: "updateItem Error", e});
});
};

const deleteItem = (req, res) => {
const {itemId} = req.params;
console.log(itemId);

ClothingItem.findByIdAndDelete(itemId).orFail().then((item) => res.status(204).send({}).catch((e) => {
  res.status(500).send({message: "deleteItem Error", e});
}));
};

module.exports = {
  createItem, getItems, updateItem, deleteItem
}