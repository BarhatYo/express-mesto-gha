const User = require('../models/user');

// const BAD_REQUEST = 400;
// const NOT_FOUND = 404;
// const SERVER_ERROR = 500;

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
      res.status(500).send({ message: 'Ошибка на стороне сервера' });
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
          .status(404).send({ message: 'Пользователь по ID не найден' });
      }
      if (err.name === 'CastError') {
        return res
          .status(400).send({ message: 'Передан невалидный ID' });
      }
      return res
        .status(500).send({ message: 'Ошибка на стороне сервера' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({
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
          .status(400).send({ message: 'Переданы некорректные данные в метод создания пользователя' });
      }
      return res
        .status(500).send({ message: 'Ошибка на стороне сервера' });
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
          .status(400).send({ message: 'Переданы некорректные данные в метод обновления профиля' });
      }
      return res
        .status(500).send({ message: 'Ошибка на стороне сервера' });
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
          .status(400).send({ message: 'Переданы некорректные данные в метод обновления аватара' });
      }
      return res
        .status(500).send({ message: 'Ошибка на стороне сервера' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
