const jwt = require('jsonwebtoken');
const { AutorizationError } = require('../errors/AutorizationError');
const { SECRET_STRING } = require('../config');

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    next(new AutorizationError('Пользователь не зарегистрирован'));
  }

  const token = authorization;
  let payload;
  try {
    payload = jwt.verify(token, SECRET_STRING);
  } catch (err) {
    next(new AutorizationError('Пользователь не зарегистрирован'));
  }

  req.user = payload;

  next();
}

module.exports = auth;
