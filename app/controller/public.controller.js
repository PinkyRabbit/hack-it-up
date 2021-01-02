const marked = require('marked');
const fs = require('fs').promises;
const path = require('path');
const createError = require('http-errors');
const passport = require('passport');

const db = require('../database.methods');
const { ArticleCollection, CategoryCollection, TagCollection } = require('../database');
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
    image: '/images/main.jpg',
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
    image: category.image ? `/b/${category.image}` : '/images/main.jpg',
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
    image: '/images/unpublished.jpg',
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
    image: '/images/main.jpg',
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
    image: '/images/about-me.jpg',
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
    image: '/images/offers.jpg',
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

const recaptchaFront = process.env.RECAPTCHA_FRONT;

/**
 * Get login page.
 */
function loginPage(req, res) {
  const csrfToken = req.csrfToken();
  const page = {
    title: 'Вход...',
    description: 'Нечего тебе тут делать, дорогой друг :)',
    h1: 'Дорога в эхо',
    image: '/images/login.jpg',
  };
  return res.render('login', {
    page,
    recaptchaFront,
    csrfToken,
  });
}

/**
 * Login with passport.
 */
function loginRequest(req, res, next) {
  return passport.authenticate('local', (error, uuid, msg) => {
    if (error) {
      next(error);
    }
    if (msg) {
      req.flash('info', msg.message);
      return res.redirect('back');
    }
    return req.logIn(uuid, (err) => {
      if (err) return next(err);
      return req.session.save(() => {
        req.flash('success', 'Вижу вас как на яву!');
        res.redirect('/');
      });
    });
  })(req, res, next);
}

/**
 * Logout method.
 */
function logout(req, res) {
  req.logout();
  req.flash('info', 'Вы вышли. Никогда не знаешь где тебе повезёт!');
  return res.redirect('/');
}

/**
 * Search in top of the site.
 */
async function searchArticle(req, res) {
  const { search } = req.query;
  // eslint-disable-next-line no-useless-escape
  const re = `.*${search.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}.*`;
  const articles = await ArticleCollection.find({
    $and: [
      { isPublished: true },
      {
        $or: [
          { h1: { $regex: re, $options: 'i' } },
          { title: { $regex: re, $options: 'i' } },
          { description: { $regex: re, $options: 'i' } },
          { keywords: { $regex: re, $options: 'i' } },
        ],
      },
    ],
  });
  if (!articles || !articles.length) {
    return res.json([]);
  }
  const firstFiveArticles = articles.slice(0, 5);
  const categoryIdArray = firstFiveArticles.map((article) => article.category);
  const categories = await CategoryCollection.find({ _id: { $in: categoryIdArray } });
  const result = firstFiveArticles.map((article) => {
    const relatedCategory = categories.find((category) => `${category._id}` === `${article.category}`);
    const categorySlug = relatedCategory ? relatedCategory.slug : 'unknown';
    return {
      categorySlug,
      articleSlug: article.slug,
      h1: article.h1,
    };
  });
  return res.json(result);
}

module.exports = {
  getHomePage,
  getArticleBySlug,
  getArticleById,
  getCategory,
  getArticlesByTag,
  getUnpublished,
  getStatic,
  loginPage,
  loginRequest,
  logout,
  searchArticle,
};
