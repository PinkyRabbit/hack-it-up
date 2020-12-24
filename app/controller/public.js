const marked = require('marked');
const fs = require('fs').promises;
const path = require('path');
const createError = require('http-errors');

const db = require('../database.methods');
const { CategoryCollection, TagCollection } = require('../database');
const { reservedCategorySlugs } = require('../routes/constants');

/**
 * Get home page / news feed
 */
async function getHomePage(req, res) {
  const page = {
    title: 'Главная',
    keywords: 'nodejs, программирование, блог',
    description: 'Этот блог родился, когда я делал первые шаги в NodeJS. В нём я публикую свои мысли и заметки про программирование и лучше писать код.',
    h1: 'Hello world!',
    image: 'd/main.jpg',
  };
  const articles = await db.getArticlesForFeed(1);
  return res.render('news-feed', { page, articles });
}

/**
 * Get article by slug.
 */
async function getArticleBySlug(req, res, next) {
  const { categorySlug, articleSlug } = req.params;
  if (reservedCategorySlugs.includes(categorySlug)) {
    return next();
  }
  const category = await CategoryCollection.findOne({ slug: categorySlug });
  if (!category) {
    return next();
  }
  const article = await db.getFullArticleBySlug(articleSlug, category._id);
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
  const article = await db.getFullArticleById(articleId);
  if (!article) {
    return next(createError(404, 'Страница не существует'));
  }
  return res.render('article', { page: article });
}

/**
 * Get all articles in a category
 */
async function getCategory(req, res, next) {
  const { categorySlug } = req.params;
  if (reservedCategorySlugs.includes(categorySlug)) {
    return next();
  }
  const category = await CategoryCollection.findOne({ slug: categorySlug });
  const articles = await db.getArticlesForFeed(1, { category: category._id });

  const page = {
    h1: category.name,
    title: category.name,
    description: category.description,
    image: category.image ? `/b/${category.image}` : '/d/main.jpg',
  };
  return res.render('news-feed', { page, articles });
}

/**
 * Get all unpublished articles
 */
async function getUnpublished(req, res) {
  const articles = await db.getArticlesForFeed(1, { unpublished: true });
  const page = {
    h1: 'Неопубликованное',
    title: 'Неопубликованное',
    description: 'Неопубликованные статьи сайта',
    image: '/d/unpublished.jpg',
  };
  return res.render('news-feed', { page, articles, isUnpublished: true });
}

/**
 * For articles feed by tag slug.
 */
async function getArticlesByTag(req, res, next) {
  const { tagSlug } = req.params;

  const tag = await TagCollection.findOne({ slug: tagSlug });
  if (!tag) {
    return next(createError(404, 'Страница не существует'));
  }

  const articles = await db.getArticlesForFeed(1, { tag: tag._id });

  const page = {
    title: `Тег ${tag.name}`,
    keywords: tag.name,
    description: `Эта страница посвящена ${tag.name}. Блог разработчика. Программирование - интересное приключение.`,
    h1: `Тег ${tag.name}`,
    image: 'd/main.jpg',
  };

  return res.render('news-feed', {
    page,
    articles,
  });
}

/**
 * To display static About me page.
 */
async function aboutMePage(res) {
  const aboutMeFile = path.join(__dirname, '../../static/about-me.md');
  const aboutMeMarkup = await fs.readFile(aboutMeFile, 'utf-8');
  const page = {
    isStatic: true,
    title: 'Introduce',
    h1: 'Пару слов обо мне',
    keywords: 'NodeJS, разработчик, резюме',
    description: 'Пару слов обо мне. Эта страничка оформлена в виде рассказа о себе и не несёт рекламный характер. Это не CV.',
    image: '/d/about-me.jpg',
    content: marked(aboutMeMarkup),
  };
  res.render('article', { page });
}

/**
 * To display static Offers page.
 */
async function offersPage(res) {
  const aboutMeFile = path.join(__dirname, '../../static/offers.md');
  const offersMarkup = await fs.readFile(aboutMeFile, 'utf-8');
  const page = {
    isStatic: true,
    title: 'Introduce',
    h1: 'Я рекомендую',
    keywords: 'NodeJS программы софт',
    description: 'Страничка где я выкладываю полезные инструменты для NodeJS разработчика, которые я рекомендую.',
    image: '/d/offers.jpg',
    content: marked(offersMarkup),
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
    case 'offers':
      staticPageFunction = () => offersPage(res);
      break;
    default:
      return next();
  }

  return await staticPageFunction();
}

module.exports = {
  getHomePage,
  getArticleBySlug,
  getArticleById,
  getCategory,
  getArticlesByTag,
  getUnpublished,
  getStatic,
};
