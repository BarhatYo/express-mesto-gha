const User = require('../models/user');
const {
  CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR,
} = require('../constants/statusCodes');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      const formattedUsers = users.map((user) => ({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user.id,
      }));
      res.send({ data: formattedUsers });
    })
    .catch((err) => {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId).orFail(new Error('NotFound'))
    .then((user) => {
      res.send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user.id,
        },
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === 'NotFound') {
        return res
          .status(NOT_FOUND).send({ message: 'Пользователь по ID не найден' });
      }
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST).send({ message: 'Передан невалидный ID' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send({
      data: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        about: user.about,
      },
    }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST).send({ message: 'Переданы некорректные данные в метод создания пользователя' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({
      data: {
        name: user.name,
        _id: user._id,
        avatar: user.avatar,
        about: user.about,
      },
    }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST).send({ message: 'Переданы некорректные данные в метод обновления профиля' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

const updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({
      data: {
        name: user.name,
        _id: user._id,
        avatar: user.avatar,
        about: user.about,
      },
    }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST).send({ message: 'Переданы некорректные данные в метод обновления аватара' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
