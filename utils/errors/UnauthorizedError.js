class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = 401;
    this.message = ({message: "Invalid email or password"});
  }
}

module.exports = { UnauthorizedError };