const session = require('express-session');
const cookieParser = require('cookie-parser');
const memorystore = require('memorystore');
const passport = require('passport');

const { initPassport } = require('./auth');

const ttl = process.env.SESSION_HOURS
  ? parseInt(process.env.SESSION_HOURS, 10) * 60 * 60 * 1000
  : 43200000;

const MemoryStore = memorystore(session);
const store = new MemoryStore({ checkPeriod: ttl });

const sessionOptions = {
  name: process.env.SESSION_NAME,
  resave: false,
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: ttl,
    secure: 'auto',
    sameSite: true,
  },
  store,
};

module.exports = (app) => {
  initPassport();

  app.use(session(sessionOptions));
  app.use(cookieParser());

  app.use(passport.initialize());
  app.use(passport.session());
};
