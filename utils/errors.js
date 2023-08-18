class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
   this.message = "Invalid User";
  }
};

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
};

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.name= "ServerError";
    this.statusCode = 500;
  }
};

module.exports = {ValidationError, NotFoundError, ServerError};
