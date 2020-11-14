const pageOptions = require('../../pages.json');

const recaptchaFront = process.env.RECAPTCHA_FRONT;

function loginPage(req, res) {
  const csrfToken = req.csrfToken();
  return res.render('login', {
    page: pageOptions.login,
    recaptchaFront,
    csrfToken,
  });
}

function loginRequest(req, res) {
  res.redirect('/login');
}

module.exports = {
  loginPage,
  loginRequest,
};
