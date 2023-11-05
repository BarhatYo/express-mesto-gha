class Conflict extends Error {
  constructor(message) {
    super(message);
    this.message = 'Пользователь с таким email уже зарегистрирован';
    this.statusCode = 409;
  }
}

module.exports = Conflict;
