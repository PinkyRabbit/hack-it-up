const createError = require('http-errors');

const { Article } = require('../factories');
const { ArticleCollection, TagCollection, CategoryCollection } = require('../database');
const { getFullArticleById } = require('../database.methods');
const { uploadImageToBucket } = require('../util/s3');

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
 * To display edit article page. If article was published status will changes to unpublished
 */
async function getEditArticlePage(req, res, next) {
  const { articleId } = req.params;
  const article = await getFullArticleById(articleId);
  if (!article) {
    return next(createError(404, 'Страница не существует'));
  }
  if (article.isPublished) {
    await ArticleCollection
      .findOneAndUpdate({ _id: articleId }, { $set: { isPublished: false } });
  }
  return res.render('edit-article', {
    article,
    page: {
      title: 'Редактирование...',
      h1: 'Редактор статьи',
      image: '/images/admin.jpg',
    },
  });
}

/**
 * Construct new article from body and updates it in database
 */
async function updateArticle(articleId, plainArticleObject) {
  const article = new Article(plainArticleObject);
  article.updatedAt = (new Date()).toISOString();
  if (Array.isArray(article.tags) === false) {
    article.tags = [article.tags];
  }
  if (article.tags.length) {
    const tags = await TagCollection.find({ name: { $in: article.tags } });
    article.tags = tags.map((tag) => tag._id);
  }

  await ArticleCollection.update({ _id: articleId }, { $set: article });

  if (article.category) {
    const category = await CategoryCollection.findOne({ _id: article.category });
    article.category = category ? category.slug : null;
  }
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
  const updatedArticle = await updateArticle(articleId, req.body);
  let redirectUrl = `/article/${articleId}`;
  const { slug, category } = updatedArticle;
  if (slug && category) {
    redirectUrl = `/${category}/${slug}`;
  }
  res.redirect(redirectUrl);
}

/**
 * Delete old image and set new as article image.
 */
async function updateArticleImage(req, res, next) {
  if (!req.file) {
    return next(createError(400, 'Изображение не найдено.'));
  }
  const { articleId } = req.params;
  const article = await ArticleCollection.findOne({ _id: articleId });

  const uploadedFileName = await uploadImageToBucket(req.file, article.image);
  await ArticleCollection.update({ _id: articleId }, { $set: { image: `${uploadedFileName}` } });

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

/**
 * Method to push current article into body. Validation purposes only.
 */
async function extractArticle(req, res, next) {
  const { articleId } = req.params;
  const article = await ArticleCollection.findOne({ _id: articleId });
  if (!article) {
    return next(createError(404, 'Страница не существует'));
  }
  req.body = article;
  return next();
}

/**
 * For publishing the article.
 */
async function publish(req, res) {
  const { articleId } = req.params;
  const dateOfUpdate = (new Date()).toISOString();
  const updatedArticle = await ArticleCollection.findOneAndUpdate(
    { _id: articleId },
    {
      $set: {
        isPublished: true,
        updatedAt: dateOfUpdate,
      },
    },
  );
  const category = await CategoryCollection.findOneAndUpdate(
    { _id: updatedArticle.category },
    {
      $set: {
        updatedAt: dateOfUpdate,
      },
    },
  );
  res.redirect(`/${category.slug}/${updatedArticle.slug}`);
}

module.exports = {
  createArticle,
  getEditArticlePage,
  autosaveArticle,
  saveArticle,
  updateArticleImage,
  deleteArticle,
  extractArticle,
  publish,
};
