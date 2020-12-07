const idValidators = require('./id.validatiors');
const slugValidators = require('./slug.validators');

module.exports = {
  ...idValidators,
  ...slugValidators,
};
