const { query, validationResult } = require('express-validator');

/**
 * If search string is impty return nothing
 */
function ifSearchStringEmpty(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.send([]);
}

module.exports = {
  searchValidator: [
    query('search').trim().matches(/[a-zа-я]{2,}/i),
    ifSearchStringEmpty,
  ],
};
