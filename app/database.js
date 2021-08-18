const monk = require('monk');

const { MONGO_URL, MONGO_SRV } = process.env;
if (!MONGO_URL) {
  console.log('No credentials for mongodb connection.');
  process.exit(1);
}

const url = MONGO_SRV === 'ok'
  ? `mongodb+srv://${MONGO_URL}?retryWrites=true&w=majority`
  : MONGO_URL;

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
