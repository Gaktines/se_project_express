// middleware/auth.js

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { AuthorizationError } = require("../utils/errors/AuthorizationError");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    const authorizationError = new AuthorizationError();
    return res
      .status(authorizationError.statusCode)
      .send({ message: authorizationError.message });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.log(AuthorizationError);
    const authorizationError = new AuthorizationError();
    return res
      .status(authorizationError.statusCode)
      .send({ message: authorizationError.message });
  }

  req.user = payload; // assigning the payload to the request object

  return next(); // sending the request to the next middleware
};
