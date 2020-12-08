const publicPagesRouter = require('./public-pages');
const editArticleRouter = require('./admin.article-editor');
const errorHandler = require('./error-handler');
const other = require('./other');

// @FIXME: show categories without description!
// @FIXME: show tags without description!

module.exports = {
  errorHandler,
  loginPage: other.loginPage,
  loginRequest: other.loginRequest,
  publicPagesRouter,
  editArticleRouter,
};
