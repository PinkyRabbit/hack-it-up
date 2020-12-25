const { CategoryCollection, ArticleCollection } = require('../database');
const { Category } = require('../factories');

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

module.exports = {
  manageCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
