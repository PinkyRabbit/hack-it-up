const csrf = require('csurf');

const controller = require('../controller');
const validators = require('../validators');
const recaptchaTest = require('../middleware/recaptcha');
const { uploadArticleImage } = require('../middleware/multer');
const { isAuthenticated } = require('../middleware/auth');

const csrfProtection = csrf({ cookie: true });

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
    isAuthenticated,
    validators.articleIdValidator,
    controller.getArticleById,
  ],
  getStaticPage: [
    controller.getStatic,
  ],
  getUnpublishedArticles: [
    isAuthenticated,
    controller.getUnpublished,
  ],
  createArticle: [
    isAuthenticated,
    controller.createArticle,
  ],
  getEditArticlePage: [
    isAuthenticated,
    validators.articleIdValidator,
    controller.getEditArticlePage,
  ],
  autosave: [
    isAuthenticated,
    validators.articleIdValidator,
    controller.autosaveArticle,
  ],
  saveArticle: [
    isAuthenticated,
    validators.articleIdValidator,
    controller.saveArticle,
  ],
  updateArticleImage: [
    isAuthenticated,
    validators.articleIdValidator,
    uploadArticleImage,
    controller.updateArticleImage,
  ],
  publishArticle: [
    isAuthenticated,
    validators.articleIdValidator,
    controller.extractArticle,
    validators.articleValidator,
    controller.publish,
  ],
  deleteArticle: [
    isAuthenticated,
    validators.articleIdValidator,
    controller.deleteArticle,
  ],
  getLoginPage: [
    csrfProtection,
    controller.loginPage,
  ],
  sendLoginRequest: [
    csrfProtection,
    recaptchaTest,
    validators.loginValidator,
    controller.loginRequest,
  ],
  logout: [
    isAuthenticated,
    controller.logout,
  ],
  manageCategories: [
    isAuthenticated,
    controller.manageCategories,
  ],
  createCategory: [
    isAuthenticated,
    validators.categoryValidator,
    controller.createCategory,
  ],
  updateCategory: [
    isAuthenticated,
    validators.categoryIdValidator,
    validators.categoryValidator,
    controller.updateCategory,
  ],
  deleteCategory: [
    isAuthenticated,
    validators.categoryIdValidator,
    controller.deleteCategory,
  ],
  manageTags: [
    isAuthenticated,
    controller.manageTags,
  ],
  searchTag: [
    isAuthenticated,
    validators.searchValidator,
    controller.searchTagRequest,
  ],
  createANewTag: [
    isAuthenticated,
    controller.createANewTag,
  ],
  updateTag: [
    isAuthenticated,
    validators.tagIdValidator,
    validators.tagValidator,
    controller.updateTag,
  ],
  deleteTag: [
    isAuthenticated,
    validators.tagIdValidator,
    controller.deleteTag,
  ],
  getArticlesByTag: [
    validators.tagSlugValidator,
    controller.getArticlesByTag,
  ],
};

module.exports = { routerCompositionTo };
