const connectFlash = require('connect-flash');

module.exports = (app) => {
  app.use(connectFlash());
  app.get('*', (req, res, next) => {
    const messages = [];
    // primary success danger
    const flash = req.flash();
    if (flash) {
      for (const key in flash) { // eslint-disable-line no-restricted-syntax
        if (Object.prototype.hasOwnProperty.call(flash, key) && flash[key].length) {
          for (let count = 0; count < flash[key].length; count += 1) {
            messages.push({ type: key, msg: flash[key][count] });
          }
        }
      }
    }

    if (req.session && req.session.validationErrors) {
      const ve = req.session.validationErrors;
      for (let i = 0; i < ve.length; i += 1) {
        messages.push({ type: 'warning', msg: ve[i] });
      }
      req.session.validationErrors = null;
    }

    if (messages) res.locals.messages = messages;
    next();
  });
};
