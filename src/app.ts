import express from 'express';
import helmet from 'helmet';
import hbs from 'hbs';
import path from 'path';
import { mainRouter } from './router';
require('./config/firebase-admin');

const app = express();

const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.set('views', viewsPath);
app.set('view engine', 'hbs');
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirPath));

app.use(helmet());
app.use(express.json());

app.use('/', mainRouter);

export { app };
