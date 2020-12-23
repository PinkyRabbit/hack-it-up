const { param, validationResult } = require('express-validator');

/**
 * Redirect back with flash if mongoId is invalid
 */
function redirectIfInvalid(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  errors.array().forEach((error) => {
    const errorMessage = `Request param <strong>${error.param}</strong> is invalid`;
    req.flash('danger', errorMessage);
  });
  return res.status(400).redirect('back');
}

module.exports = {
  articleIdValidator: [param('articleId').trim().isMongoId(), redirectIfInvalid],
  tagIdValidator: [param('tagId').trim().isMongoId(), redirectIfInvalid],
  categoryIdValidator: [param('categoryId').trim().isMongoId(), redirectIfInvalid],
};
