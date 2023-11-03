class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
    this.message = ({message: "Server Error"});
  }
}

module.exports = { BadRequestError };