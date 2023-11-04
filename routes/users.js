const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, updateUser, updateAvatar, getProfile, getUser,
} = require('../controllers/users');

const linkValidator = (value) => {
  const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return regex.test(value);
};

router.get('/', getUsers);

router.get('/me', getProfile);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).required(),
    about: Joi.string().min(2).required(),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(linkValidator, 'custom validation').required(),
  }),
}), updateAvatar);

module.exports = router;
