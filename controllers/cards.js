const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      const formattedCards = cards.map((card) => ({
        likes: card.likes,
        _id: card._id,
        name: card.name,
        link: card.link,
        createdAt: card.createdAt,
        owner: card.owner,
      }));
      res.send({ data: formattedCards });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: 'Ошибка на стороне сервера' });
    });
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({
      data: {
        likes: card.likes,
        _id: card._id,
        name: card.name,
        link: card.link,
        createdAt: card.createdAt,
        owner: card.owner,
      },
    }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res
          .status(400).send({ message: 'Переданы некорректные данные в метод создания карточки' });
      }
      return res
        .status(500).send({ message: err.message });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId).orFail(new Error('NotFound'))
    .then(() => res.send({ message: 'Пост удалён' }))
    .catch((err) => {
      console.error(err);
      if (err.message === 'NotFound') {
        return res
          .status(404).send({ message: 'Карточка не найдена' });
      }
      if (err.name === 'CastError') {
        return res
          .status(400).send({ message: 'Передан невалидный ID' });
      }
      return res
        .status(500).send({ message: err.message });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: cardId } },
    { new: true },
  ).orFail(new Error('NotFound'))
    .then((card) => res.send({
      data: {
        likes: card.likes,
        _id: card._id,
        name: card.name,
        link: card.link,
        createdAt: card.createdAt,
        owner: card.owner,
      },
    }))
    .catch((err) => {
      console.error(err);
      if (err.message === 'NotFound') {
        return res
          .status(404).send({ message: 'Карточка не найдена' });
      }
      if (err.name === 'CastError') {
        return res
          .status(400).send({ message: 'Передан невалидный ID' });
      }
      return res
        .status(500).send({ message: err.message });
    });
};

const unlikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: cardId } },
    { new: true },
  ).orFail(new Error('NotFound'))
    .then((card) => res.send({
      data: {
        likes: card.likes,
        _id: card._id,
        name: card.name,
        link: card.link,
        createdAt: card.createdAt,
        owner: card.owner,
      },
    }))
    .catch((err) => {
      console.error(err);
      if (err.message === 'NotFound') {
        return res
          .status(404).send({ message: 'Карточка не найдена' });
      }
      if (err.name === 'CastError') {
        return res
          .status(400).send({ message: 'Передан невалидный ID' });
      }
      return res
        .status(500).send({ message: err.message });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
