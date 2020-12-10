const express = require('express');
const createError = require('http-errors');

const validators = require('../validators');
const { Article } = require('../factories');
const { mongodbId, ArticleCollection } = require('../database');

const pagesOptions = require('../../pages.json');
const categories = require('../categories.json');

/**
 * Creates a new empty article and redirect to edit page
 */
async function createArticle(req, res) {
  const emptyArticle = new Article({});
  const date = (new Date()).toISOString();
  emptyArticle.isPublished = false;
  emptyArticle.createdAt = date;
  emptyArticle.updatedAt = date;
  const newArticle = await ArticleCollection.insert(emptyArticle);
  const redirectUrl = `/admin/article/${newArticle._id}`;
  return res.redirect(redirectUrl);
}

/**
 * To display edit article page. If article was published status will changes to unpublised
 */
async function getEditArticlePage(req, res, next) {
  const { articleId } = req.params;
  const _id = mongodbId(articleId);
  const article = await ArticleCollection.findOne({ _id });
  if (!article) {
    return next(createError(404, 'Страница не существует'));
  }
  if (article.isPublished) {
    await ArticleCollection.update({ _id }, { $set: { isPublished: false } });
  }
  return res.render('edit-article', {
    article,
    categories,
    page: pagesOptions.editArticle,
  });
}

/**
 * Construct new article from body and updates it in database
 */
async function updateArticle(articleId, plainArticleObject) {
  const article = new Article(plainArticleObject);
  article.updatedAt = (new Date()).toISOString();
  await ArticleCollection.update({ _id: articleId }, { $set: article });
  return article;
}

/**
 * Method for autosave article (no redirect)
 */
async function autosaveArticle(req, res) {
  const { articleId } = req.params;
  await updateArticle(articleId, req.body);
  res.send({ success: true });
}

/**
 * Method for saving article and redirect to preview page
 */
async function saveArticle(req, res) {
  const { articleId } = req.params;
  const updatedFields = await updateArticle(req.body);
  let redirectUrl = `/admin/article/${articleId}`;
  const { slug, categoryId } = updatedFields;
  if (slug && categoryId) {
    redirectUrl = `/${categoryId}/${slug}`;
  }
  res.redirect(`/admin/article/${redirectUrl}`);
}

function updateImage(req, res) {
  const { articleId } = req.params;

  res.redirect(`/admin/article/${articleId}`);
}

function publish(req, res) {
  const { articleId } = req.params;

  res.redirect(`/admin/article/${articleId}`);
}

/**
 * To delete article
 */
async function deleteAnArticle(req, res) {
  const { articleId } = req.params;
  await ArticleCollection.remove({ _id: articleId });
  req.flash('success', 'Статья успешно удалена.');
  res.redirect('back');
}

// @NOTE: should be replaced with correct method
function mockSessionValidator(req, res, next) {
  return next();
}

/**
 * Create and export edit article router
 */
const adminArticleRouter = express.Router();

adminArticleRouter
  .get(
    '/add',
    mockSessionValidator,
    createArticle,
  )
  .get(
    '/:articleId',
    mockSessionValidator,
    validators.articleIdValidator,
    getEditArticlePage,
  )
  .put(
    '/:articleId',
    mockSessionValidator,
    validators.articleIdValidator,
    autosaveArticle,
  )
  .post(
    '/:articleId',
    mockSessionValidator,
    validators.articleIdValidator,
    saveArticle,
  )
  .post(
    '/:articleId/image',
    mockSessionValidator,
    validators.articleIdValidator,
    updateImage,
  )
  .get(
    '/:articleId/publish',
    mockSessionValidator,
    validators.articleIdValidator,
    publish,
  )
  .get(
    '/:articleId/delete',
    mockSessionValidator,
    validators.articleIdValidator,
    deleteAnArticle,
  );

module.exports = adminArticleRouter;
