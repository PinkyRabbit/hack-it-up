const { body, validationResult } = require('express-validator');

const { reservedCategorySlugs } = require('../routes');

const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*?$/;

/**
 * Redirect back with flash if body is invalid
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
  tagValidator: [
    body('name').trim().isLength({ min: 1, max: 15 }),
    body('slug').trim().matches(slugRegex)
      .not()
      .isIn(reservedCategorySlugs),
    redirectIfInvalid,
  ],
};
