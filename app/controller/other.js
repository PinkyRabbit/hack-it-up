const recaptchaFront = process.env.RECAPTCHA_FRONT;

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

function loginRequest(req, res) {
  res.redirect('/login');
}

module.exports = {
  loginPage,
  loginRequest,
};
