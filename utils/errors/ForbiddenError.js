class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "Forbidden Error";
    this.statusCode = 403;
    this.message = "Forbidden: Action not allowed";
  }
}

module.exports = {ForbiddenError};