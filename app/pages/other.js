const pageOptions = require('../../pages.json');

function loginPage(req, res) {
  return res.render('login', { page: pageOptions.login });
}

module.exports = {
  loginPage,
};
