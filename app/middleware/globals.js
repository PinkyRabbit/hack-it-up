const { CategoryCollection, TagCollection } = require('../database');

async function init(req, res, next) {
  res.locals.categories = await CategoryCollection.find({});
  res.locals.cloudTags = await TagCollection.aggregate([{ $sample: { size: 5 } }]);
  return next();
}

module.exports = function initGlobals(app) {
  app.get('*', init);
};
