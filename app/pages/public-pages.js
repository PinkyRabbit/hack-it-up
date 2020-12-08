const express = require('express');

const validators = require('../validators');

const pagesOptions = require('../../pages.json');
const articles = require('../articles.json');

const [mockArticle] = articles;

/**
 * Get home page / news feed
 */
function getHomePage(req, res) {
  return res.render('news-feed', {
    page: pagesOptions.main,
    articles,
  });
}

/**
 * Get single article page
 */
function getArticle(req, res) {
  const page = {
    ...pagesOptions.defaultArticle,
    ...mockArticle,
    image: `/a/${mockArticle.image}`,
  };
  res.render('article', { page });
}

// @FIXME: should be in constants
const reservedSlugs = [
  'login',
];
/**
 * Get all articles in a category
 */
function getCategory(req, res, next) {
  const { categorySlug } = req.params;
  if (reservedSlugs.includes(categorySlug)) {
    return next();
  }

  const category = {
    name: 'Some category',
    slug: 'some-category',
    description: 'some category description',
    image: '1.jpg',
  };
  const page = {
    ...pagesOptions.main,
    h1: category.name,
    title: category.name,
    descritpion: category.description,
    image: category.image ? `/b/${category.image}` : '/c/no-image.jpg',
  };
  return res.render('news-feed', { page, articles });
}

/**
 * Create and export public pages router
 */
const publicPagesRouter = express.Router();

publicPagesRouter
  .get('/', getHomePage)
  .get(
    '/:categorySlug',
    validators.categorySlugValidator,
    getCategory,
  )
  .get(
    '/:categorySlug/:articleSlug',
    validators.articleAndCategorySlugsValidator,
    getArticle,
  );

module.exports = publicPagesRouter;
