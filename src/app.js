const express = require('express');
const helmet = require('helmet');
const path = require('path');
const mainRouter = require('./router/index');

const app = express();

const viewsPath = path.join(__dirname, '../views');

app.set('views', viewsPath);
app.set('view engine', 'hbs');

app.use(helmet());
app.use(express.json());

app.use('/', mainRouter);

module.exports = app;