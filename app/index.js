require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();

const rootDirectory = path.resolve(__dirname, '..');
app.use(express.static(path.join(rootDirectory, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(rootDirectory, 'views'));

app.get('/', (req, res) => {
  res.render('main');
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
