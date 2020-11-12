require('dotenv').config();

const express = require('express');
const path = require('path');
const createError = require('http-errors');

const errorHandler = require('./pages/error');

const pages = require('../pages.json');

const app = express();

const rootDirectory = path.resolve(__dirname, '..');
app.use(express.static(path.join(rootDirectory, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(rootDirectory, 'views'));

app.get('/', (req, res) => {
  res.render('news-feed', {
    page: pages.main,
  });
});

app.use((req, res, next) => next(createError(404, 'Страница не существует')));
app.use(errorHandler);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
