import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
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

app.use(helmet({ noCache: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

app.use('/', mainRouter);

export { app };
