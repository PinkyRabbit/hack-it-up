const { CategoryCollection, TagCollection, ArticleCollection } = require('../database');
const { Tag, Category } = require('../factories');

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
 * Method to create a new category
 */
async function createCategory(req, res) {
  const category = new Category(req.body);
  const date = (new Date()).toISOString();
  category.createdAt = date;
  category.updatedAt = date;
  const existedCategory = await CategoryCollection.findOne({ slug: category.slug });
  if (existedCategory) {
    res.status(400);
    req.flash('danger', 'Такая категория уже существует.');
  } else {
    await CategoryCollection.insert(category);
    req.flash('success', 'Категория успешно создана.');
  }
  return res.redirect('back');
}

/**
 * Method to update category
 */
async function updateCategory(req, res) {
  const category = new Category(req.body);
  const date = (new Date()).toISOString();
  category.updatedAt = date;
  const existedCategory = await CategoryCollection.findOne({
    slug: category.slug,
    _id: {
      $ne: req.params.categoryId,
    },
  });
  if (existedCategory) {
    res.status(400);
    req.flash('danger', 'Такая категория уже существует.');
  } else {
    await CategoryCollection.update({ _id: req.params.categoryId }, { $set: category });
    req.flash('success', 'Категория успешно обновлена.');
  }
  return res.redirect('back');
}

/**
 * Method to delete category
 */
async function deleteCategory(req, res) {
  const { categoryId } = req.params;
  const articles = await ArticleCollection.find({ category: categoryId });
  if (articles.length) {
    res.status(400);
    req.flash('danger', 'Нельзя удалить категорию в которой находятся статьи.');
  } else {
    await CategoryCollection.remove({ _id: categoryId });
    req.flash('success', 'Категория успешно удалена.');
  }
  return res.redirect('back');
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

async function deleteTag(req, res) {
  const { tagId } = req.params;
  try {
    await TagCollection.remove({ _id: tagId });
    await ArticleCollection.update({ tag: tagId }, { $unset: { tag: tagId } });
    req.flash('success', 'Тег успешно удалён.');
  } catch (error) {
    req.flash('danger', 'Ошибка при удалении тега!');
    res.status(500);
  }
  return res.redirect('back');
}

module.exports = {
  manageCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  manageTags,
  searchTagRequest,
  createANewTag,
  updateTag,
  deleteTag,
};
