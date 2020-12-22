const csrf = require('csurf');

const pages = require('../pages');
const validators = require('../validators');
const { uploadArticleImage } = require('../middlewares/multer');

const csrfProtection = csrf({ cookie: true });

// @NOTE: should be replaced with correct method
function mockSessionValidator(req, res, next) {
  return next();
}

const routerCompositionTo = {
  getHomePage: [
    pages.getHomePage,
  ],
  getCategory: [
    validators.categorySlugValidator,
    pages.getCategory,
  ],
  getArticleAsUser: [
    validators.articleAndCategorySlugsValidator,
    pages.getArticleBySlug,
  ],
  getArticleAsAdmin: [
    mockSessionValidator,
    validators.articleIdValidator,
    pages.getArticleById,
  ],
  getStaticPage: [
    pages.getStatic,
  ],
  getUnpublishedArticles: [
    mockSessionValidator,
    pages.getUnpublished,
  ],
  createArticle: [
    mockSessionValidator,
    pages.createArticle,
  ],
  getEditArticlePage: [
    mockSessionValidator,
    validators.articleIdValidator,
    pages.getEditArticlePage,
  ],
  autosave: [
    mockSessionValidator,
    validators.articleIdValidator,
    pages.autosaveArticle,
  ],
  saveArticle: [
    mockSessionValidator,
    validators.articleIdValidator,
    pages.saveArticle,
  ],
  updateArticleImage: [
    mockSessionValidator,
    validators.articleIdValidator,
    uploadArticleImage,
    pages.updateArticleImage,
  ],
  publishArticle: [
    mockSessionValidator,
    validators.articleIdValidator,
    pages.publish,
  ],
  deleteArticle: [
    mockSessionValidator,
    validators.articleIdValidator,
    pages.deleteArticle,
  ],
  getLoginPage: [
    csrfProtection,
    pages.loginPage,
  ],
  sendLoginRequest: [
    csrfProtection,
    pages.loginRequest,
  ],
  manageCategories: [
    mockSessionValidator,
    pages.manageCategories,
  ],
  manageTags: [
    mockSessionValidator,
    pages.manageTags,
  ],
  searchTag: [
    mockSessionValidator,
    validators.searchValidator,
    pages.searchTagRequest,
  ],
  createANewTag: [
    mockSessionValidator,
    pages.createANewTag,
  ],
  updateTag: [
    mockSessionValidator,
    validators.tagIdValidator,
    validators.tagValidator,
    pages.updateTag,
  ],
};

module.exports = { routerCompositionTo };
