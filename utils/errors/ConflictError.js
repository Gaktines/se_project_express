class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
    this.message = ({message: "Conflict Error"});
  }
}

module.exports = { ConflictError };