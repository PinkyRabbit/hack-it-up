const helmet = require('helmet');
const compression = require('compression');

function enableHelmet(app) {
  const directives = {
    defaultSrc: ["'self'"],
    fontSrc: ["'self'", 'fonts.gstatic.com'],
    frameSrc: ['www.google.com', 'platform.twitter.com', 'syndication.twitter.com'],
    imgSrc: ["'self'", 'data:', 'platform.twitter.com', 'pbs.twimg.com', 'syndication.twitter.com'],
    styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com', 'platform.twitter.com', 'cdn.quilljs.com'],
    scriptSrc: ["'self'", "'unsafe-inline'", 'www.gstatic.com', 'www.google.com', 'platform.twitter.com', 'cdn.syndication.twimg.com', 'cdn.quilljs.com'],
  };
  const contentSecurityPolicy = { directives };
  app.use(helmet({ contentSecurityPolicy }));
}

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }
  // fallback to standard filter function
  return compression.filter(req, res);
}

function useCompression(app) {
  app.use(compression({ filter: shouldCompress }));
}

function productionMode(app) {
  app.set('trust proxy', 1);
  enableHelmet(app);
  useCompression(app);
}

module.exports = { productionMode };
