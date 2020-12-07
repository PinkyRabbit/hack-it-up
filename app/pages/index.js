const errorHandler = require('./error');
const newsFeed = require('./news-feed');
const article = require('./article');
const other = require('./other');

// @FIXME: show categories without description!
// @FIXME: show tags without description!

module.exports = {
  errorHandler,
  homePage: newsFeed.homePage,
  category: newsFeed.category,
  article: article.getArticle,
  loginPage: other.loginPage,
  loginRequest: other.loginRequest,
  getEditArticlePage: article.getEditArticlePage,
  updateArticle: article.updateArticle,
  updateArticleImage: article.updateImage,
};
