const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { ValidationError } = require("../utils/errors/ValidationError");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { CastError } = require("../utils/errors/CastError");
const { DuplicateEmailError } = require("../utils/errors/DuplicateEmailError");
const { AuthorizationError } = require("../utils/errors/AuthorizationError");

const {JWT_SECRET='dev-secret'} = process.env;


// create User
const createUser = (req, res, next) => {
  console.log(req);
  console.log(req.body);

  const { name, avatar, email, } = req.body;

  return User.findOne({ email })
    .then((user) => {
      console.log(user);
      if (user) {
        return next(DuplicateEmailError());
      }
      return bcrypt.hash(req.body.password, 10).then((hash) =>
        User.create({ name, avatar, email, password: hash })
          .then((newUser) => {
            console.log(newUser);
            res.status(201).send({
              data: {
                name: newUser.name,
                avatar: newUser.avatar,
                email: newUser.email,
              },
            });
          })
          .catch((e) => {
            console.error(e);
            if (e.name && e.name === "ValidationError") {
              console.log(ValidationError);
              next(new ValidationError("Error in createUser"));
            } else  {
              next(e);
            }
          }),
      );
    })
    .catch((e) => {
      console.error(e);
      if (e.name && e.name === "ValidationError") {
        console.log(ValidationError);
        next(new ValidationError("Error in createUser"));
      } else {
        next(e);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(201).send({ token });
    })
    .catch((e) => {
      console.error(e);
      if (e.message === "Incorrect email or password") {
        next(new AuthorizationError("Error in login"));
      } else {
        next(e);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => new NotFoundError())
    .then((user) => res.status(200).send({ data: user }))
    .catch((e) => {
      console.error(e);
      if (e.name && e.name === "CastError") {
        next(new CastError("Error in getCurrentUser"));
      } else if (e.name === "NotFoundError") {
        next(new NotFoundError("Error in getCurrentUser"));
      } else {
        next(e);
      }
    });
};

const updateProfile = (req, res, next) => {
  console.log(res);
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((e) => {
      console.error(e);
      if (e.name && e.name === "ValidationError") {
        next(new ValidationError("Error in updateProfile"));
      } else if (e.name === "CastError") {
        next(new CastError("Error in updateProfile"));
      } else {
        next(e);
      }
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
