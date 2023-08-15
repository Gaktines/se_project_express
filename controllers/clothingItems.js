const ClothingItem = require('../models/clothingItem');

const createItem = (req,res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({name, weather, imageURL}).then((item) => {
    console.log(item);
    res.send({data: item})
  }).catch((e) => {
    res.status(500).send({message: 'createItem Error',e});
  })
};

module.exports = {
  createItem
}