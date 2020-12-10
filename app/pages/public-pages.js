const express = require('express');
const marked = require('marked');
const fs = require('fs').promises;
const path = require('path');
const createError = require('http-errors');

const validators = require('../validators');

const pagesOptions = require('../../pages.json');
const fakeAritcles = require('../articles.json');
const { ArticleCollection } = require('../database');

/**
 * Get home page / news feed
 */
function getHomePage(req, res) {
  return res.render('news-feed', {
    page: pagesOptions.main,
    articles: fakeAritcles,
  });
}

/**
 * Get article by slug.
 */
async function getArticleBySlug(req, res, next) {
  const { articleSlug } = req.params;
  const article = await ArticleCollection.findOne({ slug: articleSlug });
  if (!article) {
    // should return next cuz article could be taken also by id
    return next();
  }
  return res.render('article', { page: article });
}

/**
 * Get article by article id.
 */
async function getArticleById(req, res, next) {
  const { articleId } = req.params;
  const article = await ArticleCollection.findOne({ _id: articleId });
  if (!article) {
    return next(createError(404, 'Страница не существует'));
  }
  return res.render('article', { page: article });
}

// @FIXME: should be in constants
const reservedSlugs = [
  'login',
  'unpublished',
  'about-me',
  'article',
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
    h1: category.name,
    title: category.name,
    descritpion: category.description,
    image: category.image ? `/b/${category.image}` : '/c/no-image.jpg',
  };
  return res.render('news-feed', { page, articles: fakeAritcles });
}

/**
 * Get all unpublished articles
 */
async function getUnpublished(req, res) {
  const articles = await ArticleCollection.find({});
  const page = {
    ...pagesOptions.main,
    h1: 'Неопубликованное',
    title: 'Неопубликованное',
    descritpion: 'Неопубликованные статьи сайта',
    image: '/d/unpublished.jpg',
  };
  return res.render('news-feed', { page, articles, isUnpublished: true });
}

/**
 * To display static About me page.
 */
async function aboutMePage(res) {
  const aboutMeFile = path.join(__dirname, '../../static/about-me.md');
  const aboutMeMarkup = await fs.readFile(aboutMeFile, 'utf-8');
  const page = {
    title: 'Introduce',
    h1: 'Пару слов обо мне',
    keywords: 'NodeJS, разработчик, резюме',
    description: 'Пару слов обо мне. Эта страничка оформлена в виде "рассказа" о себе и не несёт рекламный характер. Это не CV.',
    image: '/d/about-me.jpg',
    content: marked(aboutMeMarkup),
  };
  res.render('article', { page });
}

/**
 * Method to get static pages with markdown markup.
 */
async function getStatic(req, res, next) {
  const { staticPageSlug } = req.params;

  let staticPageFunction;
  switch (staticPageSlug) {
    case 'about-me':
      staticPageFunction = () => aboutMePage(res);
      break;
    default:
      return next();
  }

  return await staticPageFunction();
}

// @NOTE: should be replaced with correct method
function mockSessionValidator(req, res, next) {
  return next();
}

/**
 * Create and export public pages router.
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
    '/unpublished',
    mockSessionValidator,
    getUnpublished,
  )
  .get(
    '/:categorySlug/:articleSlug',
    validators.articleAndCategorySlugsValidator,
    getArticleBySlug,
  )
  .get(
    '/article/:articleId',
    mockSessionValidator,
    validators.articleIdValidator,
    getArticleById,
  )
  .get(
    '/:staticPageSlug',
    getStatic,
  );

module.exports = publicPagesRouter;
