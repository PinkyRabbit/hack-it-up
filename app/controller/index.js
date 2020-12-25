const publicController = require('./public.controller');
const articleController = require('./admin.article.controller');
const categoryController = require('./admin.category.controller');
const tagController = require('./admin.tag.controller');

module.exports = {
  ...publicController,
  ...articleController,
  ...categoryController,
  ...tagController,
};
