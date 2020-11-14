const pagesOptions = require('../../pages.json');
const articles = require('../articles.json');

const [article] = articles;

function getArticle(req, res) {
  const page = {
    ...pagesOptions.defaultArticle,
    ...article,
    image: `/a/${article.image}`,
  };
  res.render('article', { page });
}

module.exports = {
  getArticle,
};
