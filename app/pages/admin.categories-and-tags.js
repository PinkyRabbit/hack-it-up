const { CategoryCollection, TagCollection } = require('../database');

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

module.exports = {
  manageCategories,
  manageTags,
};
