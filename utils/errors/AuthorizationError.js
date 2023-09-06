class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = 401;
    this.message = ({message: "Authorization Error"});
  }
}

module.exports = { AuthorizationError };