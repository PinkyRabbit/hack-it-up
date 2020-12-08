const express = require('express');
const createError = require('http-errors');
const csrf = require('csurf');

const pages = require('./pages');

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

router
  // .get('/unknown/:articleSlug', pages.article)
  .get('/login', csrfProtection, pages.loginPage)
  .post('/login', csrfProtection, pages.loginRequest);

module.exports = (app) => {
  app.use('/', router);
  app.use('/', pages.publicPagesRouter);
  app.use('/admin/article', pages.editArticleRouter);
  app.use((req, res, next) => next(createError(404, 'Страница не существует')));
  app.use(pages.errorHandler);
};
