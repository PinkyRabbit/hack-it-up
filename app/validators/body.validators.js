const { body, validationResult } = require('express-validator');

const { reservedCategorySlugs } = require('../routes/constants');

const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*?$/;

/**
 * Redirect back with flash if body is invalid
 */
function redirectIfInvalid(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  errors.array().forEach((error) => {
    req.flash('danger', error.msg);
  });
  return res.status(400).redirect('back');
}

module.exports = {
  articleValidator: [
    body('h1', 'Длина h1 должна быть от 1 до 40 символов.').trim().isLength({ min: 1, max: 40 }),
    body('title', 'Длина title должна быть от 1 до 40 символов.').trim().isLength({ min: 1, max: 40 }),
    body('description', 'Описание является обязательным полем.').trim().not().isEmpty(),
    body('image', 'Нужно добавить изображение.').trim().not().isEmpty(),
    body('content', 'Текст статьи не может быть пустым.').trim().not().isEmpty(),
    body('category', 'Категория не выбрана.').trim().not().isEmpty(),
    body('tags', 'Нужно выбрать хотя бы 1 тег.').isArray({ min: 1 }),
    redirectIfInvalid,
  ],
  tagValidator: [
    body('name', 'Имя тега должно быть от 1 до 15 символов.').trim().isLength({ min: 1, max: 15 }),
    body('slug', 'Slug не соответствует формату.').trim().matches(slugRegex)
      .not()
      .isIn(reservedCategorySlugs),
    redirectIfInvalid,
  ],
  categoryValidator: [
    body('name', 'Имя категории должно быть от 1 до 40 символов.').trim().isLength({ min: 1, max: 40 }),
    body('description', 'Размер описания должен быть от 40 до 140 символов.').trim().isLength({ min: 40, max: 140 }),
    redirectIfInvalid,
  ],
  loginValidator: [
    body('email', 'Опечатка в почте').isEmail(),
    body('email', 'Пустой пароль').not().isEmpty(),
    redirectIfInvalid,
  ],
};
