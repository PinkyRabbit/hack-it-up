const factories = require('../factories');

const pagesOptions = require('../../pages.json');
const articles = require('../articles.json');
const categories = require('../categories.json');

const [mockArticle] = articles;

function getArticle(req, res) {
  const page = {
    ...pagesOptions.defaultArticle,
    ...mockArticle,
    image: `/a/${mockArticle.image}`,
  };
  res.render('article', { page });
}

function getEditArticlePage(req, res) {
  res.render('edit-article', {
    article: mockArticle,
    categories,
    page: pagesOptions.editArticle,
  });
}

/**
 * Construct new article from body and updates it in database
 */
async function updateArticle(plainArticleObject) {
  const article = new factories.Article(plainArticleObject);
  console.log(article);
  return Promise.resolve();
}

/**
 * Method for autosave article (no redirect)
 */
async function autosaveAtricle(req, res) {
  // const { articleId } = req.params;
  await updateArticle(req.body);
  res.send({ success: true });
}

/**
 * Method for saving article and redirect to preview page
 */
async function saveArticle(req, res) {
  const { articleId } = req.params;
  await updateArticle(req.body);
  // @FIXME: incorrect redirect!
  res.redirect(`/admin/article/${articleId}`);
}

function updateImage(req, res) {
  const { articleId } = req.params;

  res.redirect(`/admin/article/${articleId}`);
}

function publish(req, res) {
  const { articleId } = req.params;

  res.redirect(`/admin/article/${articleId}`);
}

module.exports = {
  getArticle,
  getEditArticlePage,
  autosaveAtricle,
  saveArticle,
  updateImage,
  publish,
};
