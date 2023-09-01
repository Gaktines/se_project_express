const bcrypt = require("bcrypt");
const User = require("../models/user");
const { ValidationError } = require("../utils/errors/ValidationError");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { CastError } = require("../utils/errors/CastError");
const { ServerError } = require("../utils/errors/ServerError");
const { DuplicateEmailError } = require("../utils/errors/DuplicateEmailError");
const { JWT_SECRET } = require("../utils/config");

// get Users
const getUsers = (req, res) => {
  console.log(req);
  User.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      console.log(e);
      const serverError = new ServerError();
      return res
        .status(serverError.statusCode)
        .send({ message: serverError.message });
    });
};

// get User
const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => new NotFoundError())
    .then((item) => res.status(200).send({ data: item }))
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

// create User
const createUser = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, avatar, email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject(new Error("Incorrect password or email"));
    }
    const duplicateEmailError = DuplicateEmailError();
    return res
      .status(duplicateEmailError.statusCode)
      .send({ message: duplicateEmailError.message });
  });

  bcrypt.hash(req.body.password, 10).then((hash) =>
    User.create({ name, avatar, email, password: hash })
      .then((item) => {
        console.log(item);
        res.send({ data: item });
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
            res.status(201).send({ _id: user._id, email: user.email });
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
      // otherwise, we get an error
      const duplicateEmailError = DuplicateEmailError();
      return res
        .status(duplicateEmailError.statusCode)
        .send({ message: duplicateEmailError.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
};
