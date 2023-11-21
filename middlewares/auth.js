// middleware/auth.js

const jwt = require("jsonwebtoken");
const { AuthorizationError } = require("../utils/errors/AuthorizationError");

const {JWT_SECRET='dev-secret'} = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new AuthorizationError());
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return next(new AuthorizationError());
  }

  req.user = payload; // assigning the payload to the request object

  return next(); // sending the request to the next middleware
};
