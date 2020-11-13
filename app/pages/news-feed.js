const pagesOptions = require('../../pages.json');
const articles = require('../articles.json');

module.exports = {
  homePage: (req, res) => res.render('news-feed', {
    page: pagesOptions.main,
    articles,
  }),
};
