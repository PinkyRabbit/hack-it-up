const express = require('express');
const createError = require('http-errors');
const csrf = require('csurf');

const pages = require('./pages');

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

router
  .get('/', pages.homePage)
  .get('/:categorySlug', pages.category)
  .get('/:categorySlug/:articleSlug', pages.article)
  .get('/:categorySlug/:articleSlug/edit', pages.getEditArticlePage)
  .get('/login', csrfProtection, pages.loginPage)
  .post('/login', csrfProtection, pages.loginRequest);

module.exports = (app) => {
  app.use('/', router);
  app.use((req, res, next) => next(createError(404, 'Страница не существует')));
  app.use(pages.errorHandler);
};
