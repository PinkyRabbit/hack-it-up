const monk = require('monk');

const url = process.env.MONGO_URL;

monk(url).catch((err) => {
  console.log(err); // eslint-disable-line
  process.exit(1);
});

const options = {
  loggerLevel: 'error',
  useNewUrlParser: true,
};

module.exports = {
  mongodbId: (_id) => monk.id(_id),
  ArticleCollection: monk(url, options).get('articles'),
  CategoryCollection: monk(url, options).get('categories'),
  TagCollection: monk(url, options).get('tags'),
};
