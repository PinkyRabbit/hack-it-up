const axios = require('axios').default;

const {
  NODE_ENV,
  RECAPTCHA_BACK,
  RECAPTCHA_DISABLED,
} = process.env;

/**
 * Middleware for recaptcha testing.
 */
function recaptchaTest(req, res, next) {
  if (NODE_ENV !== 'production' || RECAPTCHA_DISABLED === 'ok') {
    return next();
  }

  const recaptchaResp = req.body['g-recaptcha-response'];
  if (!recaptchaResp) {
    req.flash('danger', 'Капча не введена! Вы же не робот?');
    return res.redirect('back');
  }

  const baseVerifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

  const recaptchaParams = {
    secret: RECAPTCHA_BACK,
    response: recaptchaResp,
    remoteip: req.ip,
  };
  const queryAsString = Object.entries(recaptchaParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const verifyUrl = `${baseVerifyUrl}?${queryAsString}`;

  return axios.get(verifyUrl)
    .then(({ data: { success } }) => {
      if (!success) {
        req.flash('warning', 'Ошибка при вводе капчи. Попробуйте снова.');
        return res.redirect('back');
      }
      return next();
    })
    .catch((error) => {
      req.flash('danger', `Гугл не отвечает. Ошибка: ${error.message}`);
      res.status(500).redirect('back');
    });
}

module.exports = recaptchaTest;
