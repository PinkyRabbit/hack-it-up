const pages = require('../../pages.json');

const isDevelopment = process.env.NODE_ENV === 'development';

function publicOutput(err, req, res) {
  if (err.status === 401 || err.status === 403) {
    res.redirect('/');
  }
  res.status(404).render('error-public', { page: pages.error });
}

function developmentOutput(err, req, res) {
  const page = {
    ...pages.error,
    h1: `Ошибка ${err.status}`,
    title: err.status,
  };
  res.status(err.status).render('error-private', { page, err });
}

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if (err.status >= 500) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(err));
  }
  return isDevelopment
    ? developmentOutput(err, req, res)
    : publicOutput(err, req, res);
};