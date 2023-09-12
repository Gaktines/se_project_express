const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const { ValidationError } = require("../utils/errors/ValidationError");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { CastError } = require("../utils/errors/CastError");
const { ServerError } = require("../utils/errors/ServerError");
const { DuplicateEmailError } = require("../utils/errors/DuplicateEmailError");
const { AuthorizationError } = require("../utils/errors/AuthorizationError");

// create User
const createUser = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    const authorizationError = new AuthorizationError();
    return res
      .status(authorizationError.statusCode)
      .send({ message: authorizationError.message })
      .catch((e) => {
        console.error(e);
        console.log("throwing a server error");
          const serverError = new ServerError();
          return res
            .status(serverError.statusCode)
            .send({ message: serverError.message });
      });
  }
 return User.findOne({ email }).then((user) => {
    console.log(user);
    if (user) {
      const duplicateEmailError = new DuplicateEmailError();
      return res
        .status(duplicateEmailError.statusCode)
        .send({ message: duplicateEmailError.message });
    }
    return bcrypt.hash(req.body.password, 10).then((hash) =>
      User.create({ name, avatar, email, password: hash })
        .then((newUser) => {
          console.log(newUser);
          res.status(200).send({
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
            const validationError = new ValidationError();
            return res
              .status(validationError.statusCode)
              .send({ message: validationError.message });
          }
          console.log("throwing a server error");
          const serverError = new ServerError();
          return res
            .status(serverError.statusCode)
            .send({ message: serverError.message });
          }),
    );
  }) .catch((e) => {
    console.error(e);
    if (e.name && e.name === "ValidationError") {
      console.log(ValidationError);
      const validationError = new ValidationError();
      return res
        .status(validationError.statusCode)
        .send({ message: validationError.message });
    }
    console.log("throwing a server error");
    const serverError = new ServerError();
    return res
      .status(serverError.statusCode)
      .send({ message: serverError.message });
    });
};

const login = (req, res) => {
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
        const authorizationError = new AuthorizationError();
        return res
          .status(authorizationError.statusCode)
          .send({ message: authorizationError.message });
      }
      const serverError = new ServerError();
      return res
        .status(serverError.statusCode)
        .send({ message: serverError.message });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => new NotFoundError())
    .then((user) => res.status(200).send({ data: user }))
    .catch((e) => {
      console.error(e);
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
    req.user._id,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(200).res.send({ data: user }))
    .catch((e) => {
      console.error(e);
      if (e.name && e.name === "ValidationError") {
        console.log(ValidationError);
        const validationError = new ValidationError();
        return res
          .status(validationError.statusCode)
          .send({ message: validationError.message });
      }
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
