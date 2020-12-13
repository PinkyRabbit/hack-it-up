const createError = require('http-errors');
const path = require('path');
const fs = require('fs').promises;

const { Article } = require('../factories');
const { ArticleCollection } = require('../database');

const categories = require('../categories.json');

/**
 * Creates a new empty article and redirect to edit page
 */
async function createArticle(req, res) {
  const emptyArticle = new Article({});
  const date = (new Date()).toISOString();
  emptyArticle.isPublished = false;
  emptyArticle.createdAt = date;
  emptyArticle.updatedAt = date;
  const newArticle = await ArticleCollection.insert(emptyArticle);
  const redirectUrl = `/admin/article/${newArticle._id}`;
  return res.redirect(redirectUrl);
}

/**
 * To display edit article page. If article was published status will changes to unpublised
 */
async function getEditArticlePage(req, res, next) {
  const { articleId } = req.params;
  const article = await ArticleCollection.findOne({ _id: articleId });
  if (!article) {
    return next(createError(404, 'Страница не существует'));
  }
  if (article.isPublished) {
    await ArticleCollection
      .findOneAndUpdate({ _id: articleId }, { $set: { isPublished: false } });
  }
  return res.render('edit-article', {
    article,
    categories,
    page: {
      title: 'Редактирование...',
      h1: 'Редактор статьи',
      image: 'd/admin.jpg',
    },
  });
}

/**
 * Construct new article from body and updates it in database
 */
async function updateArticle(articleId, plainArticleObject) {
  const article = new Article(plainArticleObject);
  article.updatedAt = (new Date()).toISOString();
  await ArticleCollection.update({ _id: articleId }, { $set: article });
  return article;
}

/**
 * Method for autosave article (no redirect)
 */
async function autosaveArticle(req, res) {
  const { articleId } = req.params;
  await updateArticle(articleId, req.body);
  res.send({ success: true });
}

/**
 * Method for saving article and redirect to preview page
 */
async function saveArticle(req, res) {
  const { articleId } = req.params;
  const updatedFields = await updateArticle(articleId, req.body);
  let redirectUrl = `/article/${articleId}`;
  const { slug, categoryId } = updatedFields;
  if (slug && categoryId) {
    redirectUrl = `/${categoryId}/${slug}`;
  }
  res.redirect(redirectUrl);
}

/**
 * Delete old image and set new as article image.
 */
async function updateArticleImage(req, res) {
  const { articleId } = req.params;
  const article = await ArticleCollection.findOne({ _id: articleId });

  if (article.image) {
    const pathToOldImage = path.join(__dirname, '../../public/images/', article.image);
    try {
      await fs.unlink(pathToOldImage);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  if (req.file) {
    const { filename } = req.file;
    await ArticleCollection.update({ _id: articleId }, { $set: { image: `a/${filename}` } });
  }
  req.flash('success', 'Изображение успешно обновлено.');
  return res.redirect(`/admin/article/${articleId}`);
}

/**
 * To delete article
 */
async function deleteArticle(req, res) {
  const { articleId } = req.params;
  await ArticleCollection.remove({ _id: articleId });
  req.flash('success', 'Статья успешно удалена.');
  res.redirect('back');
}

function publish(req, res) {
  const { articleId } = req.params;

  res.redirect(`/admin/article/${articleId}`);
}

module.exports = {
  createArticle,
  getEditArticlePage,
  autosaveArticle,
  saveArticle,
  updateArticleImage,
  deleteArticle,
  publish,
};
