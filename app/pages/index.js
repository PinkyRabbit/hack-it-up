const errorHandler = require('./error');
const newsFeed = require('./news-feed');
const article = require('./article');
const other = require('./other');

module.exports = {
  errorHandler,
  homePage: newsFeed.homePage,
  category: newsFeed.category,
  article: article.getArticle,
  loginPage: other.loginPage,
};
