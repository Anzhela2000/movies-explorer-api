const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AutorizationError = require('../errors/AutorizationError');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AutorizationError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AutorizationError('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

const User = mongoose.model('user', userSchema);

module.exports = User;
