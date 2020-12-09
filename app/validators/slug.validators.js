const { param, validationResult } = require('express-validator');

const createError = require('http-errors');

const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*?$/;

/**
 * Throw 404 error if wrong slug format
 */
function pageNotFoundIfInvalid(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return next(createError(404, 'Страница не существует'));
}

module.exports = {
  articleAndCategorySlugsValidator: [
    param('articleSlug').trim().matches(slugRegex),
    param('categorySlug').trim().matches(slugRegex),
    pageNotFoundIfInvalid,
  ],
  categorySlugValidator: [
    param('categorySlug').trim().matches(slugRegex),
    pageNotFoundIfInvalid,
  ],
};
