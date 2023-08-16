const User = require('../models/user');

// get Users
const getUsers = (req, res) => {
  console.log(req);
  User.find({}).then((items) => res.status(200).send(items)).catch((e) => {
    res.status(500).send({message: "getUsers Error", e});
  })
};

// get User
const getUser = (req,res) => {
  const {userId} = req.params;
  const {imageURL} = req.body;

  User.findById(userId, {$set: {imageURL}}).orFail().then((item) => res.status(200).send({data:item})).catch((e) => {
    res.status(500).send({message: "updateItem Error", e});
});
};

// create User
const createUser = (req,res) => {
  console.log(req);
  console.log(req.body);

  const { name, avatar } = req.body;

  User.create({name, avatar}).then((item) => {
    console.log(item);
    res.send({data: item})
  }).catch((e) => {
    res.status(500).send({message: 'createItem Error',e});
  })
};

module.exports = {
  getUsers, getUser, createUser
}