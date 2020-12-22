const createError = require('http-errors');

const { CategoryCollection, TagCollection } = require('../database');
const { Tag } = require('../factories');
const { getArticlesForFeed } = require('../database.methods');

/**
 * Method to get manage categories page.
 */
async function manageCategories(req, res) {
  const categories = await CategoryCollection.find({});
  return res.render('categories-manage', {
    categories,
    page: {
      title: 'Управление категориями',
      h1: 'Управление категориями',
      image: 'd/admin.jpg',
    },
  });
}

/**
 * Method to get manage tags page.
 */
async function manageTags(req, res) {
  const tags = await TagCollection.find({});
  return res.render('tags-manage', {
    tags,
    page: {
      title: 'Управление тегами',
      h1: 'Управление тегами',
      image: 'd/admin.jpg',
    },
  });
}

/**
 * Method to search tag by name.
 */
async function searchTagRequest(req, res) {
  const { search } = req.query;
  const chunkRegex = /[a-zа-я0-9]+/ig;
  const searchChunks = search.match(chunkRegex).map((word) => new RegExp(word, 'i'));
  const tags = await TagCollection.find({ name: { $in: searchChunks } });
  return res.json({ data: tags || [] });
}

/**
 * Method for creating a new tag.
 */
async function createANewTag(req, res) {
  const tagName = req.body && req.body.tagName.trim();
  if (!tagName) {
    return res.status(400).json({ message: 'Пустая строка вместо тега.' });
  }
  const newTag = new Tag(tagName);
  const existedSlug = await TagCollection.findOne({ slug: newTag.slug });
  if (existedSlug) {
    return res.status(400).json({ message: 'Такой тег уже создан.' });
  }
  await TagCollection.insert(newTag);
  return res.json({ success: true });
}

async function updateTag(req, res) {
  const existedSlug = await TagCollection.findOne({
    slug: req.body.slug,
    _id: {
      $ne: req.params.tagId,
    },
  });
  if (existedSlug) {
    res.status(400);
    req.flash('danger', 'Такой тег уже создан.');
  } else {
    await TagCollection.update({ _id: req.params.tagId }, { $set: req.body });
    req.flash('success', 'Тег успешно обновлён.');
  }
  return res.redirect('back');
}

async function getArticlesByTag(req, res, next) {
  const { tagSlug } = req.params;

  const tag = await TagCollection.findOne({ slug: tagSlug });
  if (!tag) {
    return next(createError(404, 'Страница не существует'));
  }

  const articles = await getArticlesForFeed(1, { tagId: tag._id });

  const page = {
    title: `Тег ${tag.name}`,
    keywords: tag.name,
    description: `Эта страница посвящена ${tag.name}. Блог разработчика. Программирование - интересное приключение.`,
    h1: `Тег ${tag.name}`,
    image: 'd/main.jpg',
  };

  return res.render('news-feed', {
    page,
    articles,
  });
}

module.exports = {
  manageCategories,
  manageTags,
  searchTagRequest,
  createANewTag,
  updateTag,
  getArticlesByTag,
};
