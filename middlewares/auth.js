const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const Unauthorized = require('../utils/Unauthorized');

const handleAuthError = () => {
  throw new Unauthorized('Необходимо авторизоваться');
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};

module.exports = auth;
