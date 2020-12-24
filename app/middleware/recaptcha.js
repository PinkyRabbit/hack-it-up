const axios = require('axios').default;

const recaptchaSecret = process.env.RECAPTCHA_SECRET;
const env = process.env.NODE_ENV;

/**
 * Middleware for recaptcha testing.
 */
function recaptchaTest(req, res, next) {
  if (env !== 'production') {
    return next();
  }

  const recaptchaResp = req.body['g-recaptcha-response'];
  if (!recaptchaResp) {
    req.flash('danger', 'Капча не введена! Вы же не робот?');
    res.redirect('back');
  }

  const baseVerifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

  const recaptchaQueryObject = {
    secret: recaptchaSecret,
    response: recaptchaResp,
    remoteip: req.ip,
  };
  const queryAsString = Object.entries(recaptchaQueryObject)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const verifyUrl = `${baseVerifyUrl}?${queryAsString}`;

  return axios.get(verifyUrl)
    .then(({ data: { success } }) => {
      if (!success) {
        req.flash('warning', 'Ошибка при вводе капчи. Попробуйте снова.');
        res.redirect('back');
      }
      return next();
    })
    .catch((error) => {
      req.flash('danger', `Гугл не отвечает. Ошибка: ${error.message}`);
      res.status(500).redirect('back');
    });
}

module.exports = recaptchaTest;
