const express = require('express');
const createError = require('http-errors');

const pages = require('./pages');

const router = express.Router();

router
  .get('/', pages.homePage)
  .get('/:categorySlug', pages.category)
  .get('/:categorySlug/:articleSlug', pages.article);

module.exports = (app) => {
  app.use('/', router);
  app.use((req, res, next) => next(createError(404, 'Страница не существует')));
  app.use(pages.errorHandler);
};
