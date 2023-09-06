const bcrypt = require("bcrypt");
const User = require("../models/user");
const { ValidationError } = require("../utils/errors/ValidationError");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { CastError } = require("../utils/errors/CastError");
const { ServerError } = require("../utils/errors/ServerError");
const { DuplicateEmailError } = require("../utils/errors/DuplicateEmailError");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

// create User
const createUser = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, avatar, email } = req.body;

  User.findOne({ email }).then((user) => {
    console.log(user);
    if (user) {
      const duplicateEmailError = new DuplicateEmailError();
      return res
        .status(duplicateEmailError.statusCode)
        .send({ message: duplicateEmailError.message });
    }
    bcrypt.hash(req.body.password, 10).then((hash) =>
      User.create({ name, avatar, email, password: hash })
        .then((user) => {
          console.log(user);
          res.status(200).send({
            data: { name: user.name, avatar: user.avatar, email: user.email },
          });
        })
        .catch((e) => {
          if (e.name && e.name === "ValidationError") {
            console.log(ValidationError);
            const validationError = new ValidationError();
            return res
              .status(validationError.statusCode)
              .send({ message: validationError.message });
          }
          const serverError = new ServerError();
          return res
            .status(serverError.statusCode)
            .send({ message: serverError.message });
        }),
    );
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // we get the user object if the email and password match
      if (email === req.body.email && password === req.body.passowrd) {
        const token = jwt
          .sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: "7d",
          })
          .then((user) => {
            res.status(201).send({ _id: user._id, email: user.email, token });
          })
          .catch((e) => {
            if (e.name && e.name === "ValidationError") {
              console.log(ValidationError);
              const validationError = new ValidationError();
              return res
                .status(validationError.statusCode)
                .send({ message: validationError.message });
            }
            const serverError = new ServerError();
            return res
              .status(serverError.statusCode)
              .send({ message: serverError.message });
          });
      }
    })
    .catch((e) => {
      console.error(e);
   
    });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.user._id;

  User.findById(userId)
    .orFail(() => new NotFoundError())
    .then((user) => res.status(200).send({ data: user }))
    .catch((e) => {
      console.log(e);
      if (e.name && e.name === "CastError") {
        const castError = new CastError();
        return res
          .status(castError.statusCode)
          .send({ message: castError.message });
      }
      if (e.name && e.name === "NotFoundError") {
        console.log("throwing a NotFoundError");
        const notFoundError = new NotFoundError();
        return res
          .status(notFoundError.statusCode)
          .send({ message: notFoundError.message });
      }
      const serverError = new ServerError();
      return res
        .status(serverError.statusCode)
        .send({ message: serverError.message });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.params.id,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      return res.status(200).res.send({ data: user });
    })
    .catch((e) => {
      console.log(e);
      if (e.name && e.name === "CastError") {
        const castError = new CastError();
        return res
          .status(castError.statusCode)
          .send({ message: castError.message });
      }
      if (e.name && e.name === "NotFoundError") {
        console.log("throwing a NotFoundError");
        const notFoundError = new NotFoundError();
        return res
          .status(notFoundError.statusCode)
          .send({ message: notFoundError.message });
      }
      const serverError = new ServerError();
      return res
        .status(serverError.statusCode)
        .send({ message: serverError.message });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
