const publicPages = require('./public-pages');
const articleEditor = require('./admin.article-editor');
const other = require('./other');

// @FIXME: show categories without description!
// @FIXME: show tags without description!

module.exports = {
  ...publicPages,
  ...articleEditor,
  ...other,
};
