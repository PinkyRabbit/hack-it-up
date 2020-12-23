const publicPages = require('./public');
const articleEditor = require('./admin.article-editor');
const manageCategoriesAndTags = require('./admin.categories-and-tags');
const other = require('./other');

// @FIXME: show categories without description!
// @FIXME: show tags without description!

module.exports = {
  ...publicPages,
  ...articleEditor,
  ...manageCategoriesAndTags,
  ...other,
};
