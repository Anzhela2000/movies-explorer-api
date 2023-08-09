const jwt = require('jsonwebtoken');
const { AutorizationError } = require('../errors/AutorizationError');

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    next(new AutorizationError('Пользователь не зарегистрирован'));
  }

  const token = authorization;
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    next(new AutorizationError('Пользователь не зарегистрирован'));
  }

  req.user = payload;

  next();
}

module.exports = auth;
