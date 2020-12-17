const idValidators = require('./id.validatiors');
const slugValidators = require('./slug.validators');
const queryValidators = require('./query.validators');

module.exports = {
  ...idValidators,
  ...slugValidators,
  ...queryValidators,
};
