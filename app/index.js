const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const initSession = require('./middleware/session');
const initFlash = require('./middleware/flash');
const initGlobals = require('./middleware/globals');
const initRoutes = require('./routes');
const { productionMode } = require('./production');

const app = express();

if (process.env.NODE_ENV === 'production') {
  productionMode(app);
}

const rootDirectory = path.resolve(__dirname, '..');
app.use(express.static(path.join(rootDirectory, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(rootDirectory, 'views'));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyParser.json());

initSession(app);
initFlash(app);
initGlobals(app);
initRoutes(app);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at http://localhost:${port}`);
});
