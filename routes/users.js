const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, updateUser, updateAvatar, getProfile, getUser,
} = require('../controllers/users');

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,8})([/\w .-]*)*\/?$/).required(), // Обязательное поле, так как оно одно
  }),
}), updateAvatar);

router.get('/', getUsers);

router.get('/me', getProfile);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2), // Поле не должно быть обязательным, так как используется метод patch
    about: Joi.string().min(2), // Не должно быть обязательным, так как используется метод patch
  }),
}), updateUser);

module.exports = router;
