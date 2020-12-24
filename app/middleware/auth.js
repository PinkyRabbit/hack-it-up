const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { v4: uuidv4 } = require('uuid');
const createError = require('http-errors');

const {
  ADMIN_EMAIL: adminEmail,
  ADMIN_PASSWORD: adminPassword,
} = process.env;

if (!adminEmail || !adminPassword) {
  // eslint-disable-next-line no-console
  console.log('You should setup ADMIN_EMAIL and ADMIN_PASSWORD');
  process.exit(1);
}

const uuid = uuidv4();

/**
 * To init passport base settings.
 */
function initPassport() {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email, password, done) => {
      if (email !== adminEmail || password !== adminPassword) {
        return done(null, false, { message: 'Ошибка в логине или пароле' });
      }
      return done(null, uuid);
    },
  ));
}

function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next(createError(401, 'Для просмотра вы должны авторизироваться.'));
  }
  return next();
}

module.exports = {
  initPassport,
  isAuthenticated,
};
