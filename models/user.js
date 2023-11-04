const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const BadRequest = require('../utils/BadRequest');

const avatarUrlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9.-]+)(\/[a-zA-Z0-9.-]*)*\/?$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: {
      value: true,
      message: 'Поле является обязательным',
    },
    validate: {
      validator: validator.isEmail,
      message: (props) => `${props.value} is not a valid Email`,
    },
  },
  password: {
    type: String,
    required: {
      value: true,
      message: 'Поле является обязательным',
    },
    minlength: 4,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password, next) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new BadRequest('Неправильные почта или пароль'));
      }
      return bcrypt.compare(toString(password), user.password)
        .then((matched) => {
          if (!matched) {
            return next(new BadRequest('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
