const errorHandler = require('./error');
const newsFeed = require('./news-feed');

module.exports = {
  errorHandler,
  homePage: newsFeed.homePage,
  category: newsFeed.category,
};
