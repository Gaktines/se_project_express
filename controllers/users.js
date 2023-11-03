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
const { BadRequestError } = require("../utils/errors/BadRequestError");
const { UnauthorizedError } = require("../utils/errors/UnauthorizedError");

// create User
const createUser = (req, res, next) => {
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
  return User.findOne({ email })
    .then((user) => {
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
              next(new ValidationError("Error in createUser"));
            } else if (e.name === "BadRequestError") {
              next(new BadRequestError("Error in createUser"));
            }
          }),
      );
    })
    .catch((e) => {
      console.error(e);
      if (e.name && e.name === "ValidationError") {
        console.log(ValidationError);
        next(new ValidationError("Error in createUser"));
      } else if (e.name === "BadRequestError") {
        next(new BadRequestError("Error in createUser"));
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
        next(new UnauthorizedError("Error in login"));
      } else if (e.name === "BadRequestError") {
        next(new BadRequestError("Error in login"));
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
