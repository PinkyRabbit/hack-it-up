const csrf = require('csurf');

const controller = require('../controller');
const validators = require('../validators');
const { uploadArticleImage } = require('../middleware/multer');

const csrfProtection = csrf({ cookie: true });

// @NOTE: should be replaced with correct method
function mockSessionValidator(req, res, next) {
  return next();
}

const routerCompositionTo = {
  getHomePage: [
    controller.getHomePage,
  ],
  getCategory: [
    validators.categorySlugValidator,
    controller.getCategory,
  ],
  getArticleAsUser: [
    validators.articleAndCategorySlugsValidator,
    controller.getArticleBySlug,
  ],
  getArticleAsAdmin: [
    mockSessionValidator,
    validators.articleIdValidator,
    controller.getArticleById,
  ],
  getStaticPage: [
    controller.getStatic,
  ],
  getUnpublishedArticles: [
    mockSessionValidator,
    controller.getUnpublished,
  ],
  createArticle: [
    mockSessionValidator,
    controller.createArticle,
  ],
  getEditArticlePage: [
    mockSessionValidator,
    validators.articleIdValidator,
    controller.getEditArticlePage,
  ],
  autosave: [
    mockSessionValidator,
    validators.articleIdValidator,
    controller.autosaveArticle,
  ],
  saveArticle: [
    mockSessionValidator,
    validators.articleIdValidator,
    controller.saveArticle,
  ],
  updateArticleImage: [
    mockSessionValidator,
    validators.articleIdValidator,
    uploadArticleImage,
    controller.updateArticleImage,
  ],
  publishArticle: [
    mockSessionValidator,
    validators.articleIdValidator,
    controller.extractArticle,
    validators.articleValidator,
    controller.publish,
  ],
  deleteArticle: [
    mockSessionValidator,
    validators.articleIdValidator,
    controller.deleteArticle,
  ],
  getLoginPage: [
    csrfProtection,
    controller.loginPage,
  ],
  sendLoginRequest: [
    csrfProtection,
    controller.loginRequest,
  ],
  manageCategories: [
    mockSessionValidator,
    controller.manageCategories,
  ],
  createCategory: [
    mockSessionValidator,
    validators.categoryValidator,
    controller.createCategory,
  ],
  updateCategory: [
    mockSessionValidator,
    validators.categoryIdValidator,
    validators.categoryValidator,
    controller.updateCategory,
  ],
  deleteCategory: [
    mockSessionValidator,
    validators.categoryIdValidator,
    controller.deleteCategory,
  ],
  manageTags: [
    mockSessionValidator,
    controller.manageTags,
  ],
  searchTag: [
    mockSessionValidator,
    validators.searchValidator,
    controller.searchTagRequest,
  ],
  createANewTag: [
    mockSessionValidator,
    controller.createANewTag,
  ],
  updateTag: [
    mockSessionValidator,
    validators.tagIdValidator,
    validators.tagValidator,
    controller.updateTag,
  ],
  deleteTag: [
    mockSessionValidator,
    validators.tagIdValidator,
    controller.deleteTag,
  ],
  getArticlesByTag: [
    validators.tagSlugValidator,
    controller.getArticlesByTag,
  ],
};

module.exports = { routerCompositionTo };
