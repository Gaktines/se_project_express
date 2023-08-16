const User = require('../models/user');
const { ValidationError, NotFoundError } = require('../utils/errors');

// get Users
const getUsers = (req, res) => {
  console.log(req);
  User.find({}).then((items) => res.status(200).send(items)).catch((e) => {
    if(err.name === 'ValidationError'){
    const validationError = ValidationError();
    return res.status(validationError.getStatusCode()).send({message:validationError.getMessage()});
    }
  })
};

// get User
const getUser = (req,res) => {
  const {userId} = req.params;
  const {imageURL} = req.body;

  User.findById(userId, {$set: {imageURL}}).orFail().then((item) => res.status(200).send({data:item})).catch((e) => {
    if(err.name === 'NotFoundError'){
      const notFoundError = NotFoundError();
      return res.status(notFoundError.getStatusCode()).send({message:notFoundError.getMessage()});
      }
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
    if(err.name === 'ValidationError'){
      const validationError = ValidationError();
      return res.status(validationError.getStatusCode()).send({message:validationError.getMessage()});
      }
  })
};

module.exports = {
  getUsers, getUser, createUser
}