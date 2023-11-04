const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, updateUser, updateAvatar, getProfile, getUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getProfile);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2),
    about: Joi.string().min(2),
    avatar: Joi.string().uri().min(2),
  }),
}), updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
