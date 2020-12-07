const express = require('express');
const createError = require('http-errors');
const csrf = require('csurf');

const pages = require('./pages');
const validators = require('./validators');

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

function mockSessionValidator(req, res, next) {
  return next();
}

router
  .get('/', pages.homePage)
  .get(
    '/:categorySlug',
    validators.categorySlugValidator,
    pages.category,
  )
  .get(
    '/:categorySlug/:articleSlug',
    validators.articleAndCategorySlugsValidator,
    pages.article,
  )
  .get('/unknown/:articleSlug', pages.article)
  .get(
    '/admin/article/:articleId',
    mockSessionValidator,
    validators.articleIdValidator,
    pages.getEditArticlePage,
  )
  .post(
    '/admin/article/:articleId',
    mockSessionValidator,
    validators.articleIdValidator,
    pages.updateArticle,
  )
  .post(
    '/admin/article/:articleId/image',
    mockSessionValidator,
    validators.articleIdValidator,
    pages.updateArticleImage,
  )
  .post(
    '/admin/article/:articleId/publish',
    mockSessionValidator,
    validators.articleIdValidator,
    pages.updateArticleImage,
  )
  .get('/login', csrfProtection, pages.loginPage)
  .post('/login', csrfProtection, pages.loginRequest);

module.exports = (app) => {
  app.use('/', router);
  app.use((req, res, next) => next(createError(404, 'Страница не существует')));
  app.use(pages.errorHandler);
};
