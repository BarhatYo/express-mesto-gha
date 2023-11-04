const Card = require('../models/card');
const BadRequest = require('../utils/BadRequest');
const NotFound = require('../utils/NotFound');

const getCards = (req, res, next) => {
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
    .catch(next);
};

const createCard = (req, res, next) => {
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
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные в метод обновления профиля'));
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId).orFail(new NotFound('Карточка не найдена'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new BadRequest('Вы не являетесь владельцем карточки');
      }
      return Card.deleteOne({ cardId })
        .then(() => res.send({ message: 'Пост удалён' }))
        .catch(next);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return next(new NotFound('Карточка не найдена'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequest('Передан невалидный ID'));
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: cardId } },
    { new: true },
  ).orFail(new NotFound('Карточка не найдена'))
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
      if (err.message === 'NotFound') {
        return next(new NotFound('Карточка не найдена'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequest('Передан невалидный ID'));
      }
      return next(err);
    });
};

const unlikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: cardId } },
    { new: true },
  ).orFail(new NotFound('Карточка не найдена'))
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
      if (err.message === 'NotFound') {
        return next(new NotFound('Карточка не найдена'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequest('Передан невалидный ID'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
