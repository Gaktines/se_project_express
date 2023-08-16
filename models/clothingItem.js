const mongoose = require('mongoose');
const validator = require('validator');

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weather: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
       message: 'This is not a Link',
       }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,

  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },

  createdAt: {
    type: Date,
    required: true,
    value: Date.now,
  }
});

module.exports = mongoose.model('clothingItems', clothingItem);