const pagesOptions = require('../../pages.json');
const articles = require('../articles.json');
const categories = require('../categories.json');

const [article] = articles;

function getArticle(req, res) {
  const page = {
    ...pagesOptions.defaultArticle,
    ...article,
    image: `/a/${article.image}`,
  };
  res.render('article', { page });
}

function getEditArticlePage(req, res) {
  res.render('edit-article', {
    article,
    categories,
    page: pagesOptions.editArticle,
  });
}

function updateArticle(req, res) {
  const { articleId } = req.params;

  res.redirect(`/admin/article/${articleId}`);
}

function updateImage(req, res) {
  const { articleId } = req.params;

  res.redirect(`/admin/article/${articleId}`);
}

module.exports = {
  getArticle,
  getEditArticlePage,
  updateArticle,
  updateImage,
};
