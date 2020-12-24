const passport = require('passport');

const recaptchaFront = process.env.RECAPTCHA_FRONT;

/**
 * Get login page.
 */
function loginPage(req, res) {
  const csrfToken = req.csrfToken();
  const page = {
    title: 'Вход...',
    description: 'Нечего тебе тут делать, дорогой друг :)',
    h1: 'Дорога в эхо',
    image: 'd/login.jpg',
  };
  return res.render('login', {
    page,
    recaptchaFront,
    csrfToken,
  });
}

/**
 * Login with passport.
 */
function loginRequest(req, res, next) {
  return passport.authenticate('local', (error, uuid, msg) => {
    if (error) {
      next(error);
    }
    if (msg) {
      req.flash('info', msg.message);
      return res.redirect('back');
    }
    return req.logIn(uuid, (err) => {
      if (err) return next(err);
      return req.session.save(() => {
        req.flash('success', 'Вижу вас как на яву!');
        res.redirect('/');
      });
    });
  })(req, res, next);
}

/**
 * Logout method.
 */
function logout(req, res) {
  req.logout();
  req.flash('info', 'Вы вышли. Никогда не знаешь где тебе повезёт!');
  return res.redirect('/');
}

module.exports = {
  loginPage,
  loginRequest,
  logout,
};
