const express = require('express');
const helmet = require('helmet');
const mainRouter = require('./routers/index');

const app = express();

app.use(helmet());
app.use(express.json());

app.use('/', mainRouter);

module.exports = app;