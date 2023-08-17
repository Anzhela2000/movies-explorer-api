const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NotFoundError } = require('../errors/NotFoundError');
const { ValidationError } = require('../errors/ValidationError');
const { AutorizationError } = require('../errors/AutorizationError');
const { ConflictError } = require('../errors/ConflictError');
const User = require('../models/user');
const { userValidation } = require('../validation/user');
const { SECRET_STRING } = require('../config');

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_STRING, { expiresIn: '7d' });
      res.status(200).header('auth-token', token).send({ token });
    })
    .catch(() => {
      next(new AutorizationError('Пользователь не зарегистрирован'));
    });
};

const register = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  const { error } = userValidation(req.body);
  if (error) {
    next(new ValidationError('Данные не прошли валидацию'));
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((data) => {
      const user = data.toObject();
      delete user.password;
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Данные не прошли валидацию'));
      } if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

const patchUser = (req, res, next) => {
  const userId = req.user._id;
  const { email, name } = req.body;
  const { error } = userValidation(req.body);
  if (error) {
    next(new ValidationError('Данные не прошли валидацию'));
  }

  User.findByIdAndUpdate(
    userId,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      const user = data.toObject();
      delete user.password;
      return res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new ValidationError('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next(err);
      }
    });
};

const getMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      const user = data.toObject();
      delete user.password;
      return res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new ValidationError('Переданы некорректные данные при обновлении аватара.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  register,
  patchUser,
  login,
  getMe,
};
