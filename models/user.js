const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const user = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v) || v === undefined || "",
      message: "This is not a Link",
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "This is not a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

user.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select("+password")
    .then((newUser) => {
      if (!newUser) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      if (!email || !password) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      return bcrypt.compare(password, newUser.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }

        return newUser; // now user is available
      });
    });
};

module.exports = mongoose.model("user", user);
