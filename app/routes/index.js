const express = require('express');
const createError = require('http-errors');

const { routerCompositionTo } = require('./compositions');

const errorHandler = require('./error-handler');

module.exports.initRoutes = (app) => {
  const router = express.Router();

  router
    .get('/', routerCompositionTo.getHomePage)
    .get('/admin/article/add', routerCompositionTo.createArticle)
    .get('/admin/article/:articleId', routerCompositionTo.getEditArticlePage)
    .put('/admin/article/:articleId', routerCompositionTo.autosave)
    .post('/admin/article/:articleId', routerCompositionTo.saveArticle)
    .post('/admin/article/:articleId/image', routerCompositionTo.updateArticleImage)
    .get('/admin/article/:articleId/publish', routerCompositionTo.publishArticle)
    .get('/admin/article/:articleId/delete', routerCompositionTo.deleteArticle)
    .get('/admin/categories', routerCompositionTo.manageCategories)
    .get('/admin/tags', routerCompositionTo.manageTags)
    .post('/admin/tags', routerCompositionTo.createANewTag)
    .post('/admin/tag/:tagId', routerCompositionTo.updateTag)
    .get('/admin/tags/search', routerCompositionTo.searchTag)
    .get('/article/:articleId', routerCompositionTo.getArticleAsAdmin)
    .get('/unpublished', routerCompositionTo.getUnpublishedArticles)
    .get('/login', routerCompositionTo.getLoginPage)
    .post('/login', routerCompositionTo.sendLoginRequest)
    .get('/tag/:tagSlug', routerCompositionTo.getArticlesByTag)
    .get('/:categorySlug/:articleSlug', routerCompositionTo.getArticleAsUser)
    .get('/:staticPageSlug', routerCompositionTo.getStaticPage)
    .get('/:categorySlug', routerCompositionTo.getCategory);

  app.use('/', router);
  app.use((req, res, next) => next(createError(404, 'Страница не существует')));
  app.use(errorHandler);
};

module.exports.reservedCategorySlugs = [
  'admin', 'article', 'unpublished', 'login', 'tag',
];
