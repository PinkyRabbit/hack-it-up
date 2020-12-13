require('dotenv').config();

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const initSession = require('./middlewares/session');
const initFlash = require('./middlewares/flash');
const useCompression = require('./middlewares/compression');
const { initRoutes } = require('./routes');

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  app.use(helmet());
  useCompression(app);
}

const rootDirectory = path.resolve(__dirname, '..');
app.use(express.static(path.join(rootDirectory, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(rootDirectory, 'views'));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyParser.json());

initSession(app);
initFlash(app);
initRoutes(app);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at http://localhost:${port}`);
});
