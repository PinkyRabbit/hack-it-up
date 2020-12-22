const idValidators = require('./id.validatiors');
const slugValidators = require('./slug.validators');
const queryValidators = require('./query.validators');
const bodyValidators = require('./body.validators');

module.exports = {
  ...idValidators,
  ...slugValidators,
  ...queryValidators,
  ...bodyValidators,
};
