const User = require('../models/user');

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
    .catch((err) => res.status(500).send({ message: err.message }));
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new Error('NotFound');
      }
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
      if (err.message === 'NotFound') {
        return res
          .status(404).send({ message: 'Пользователь не найден' });
      }
      if (err.name === 'CastError') {
        return res
          .status(400).send({ message: 'Передан невалидный ID' });
      }
      return res
        .status(500).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({
      data: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        about: user.about,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400).send({ message: 'Переданы некорректные данные в метод создания пользователя' });
      }
      return res
        .status(500).send({ message: err.message });
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, {
    new: true,
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
      if (err.name === 'ValidationError') {
        return res
          .status(400).send({ message: 'Переданы некорректные данные в метод обновления профиля' });
      }
      return res
        .status(500).send({ message: err.message });
    });
};

const updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, {
    new: true,
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
      if (err.name === 'ValidationError') {
        return res
          .status(400).send({ message: 'Переданы некорректные данные в метод обновления аватара' });
      }
      return res
        .status(500).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
