class Conflict extends Error {
  constructor(message) {
    super(message);
    this.message = 'Дубль';
    this.statusCode = 409;
  }
}

module.exports = Conflict;
