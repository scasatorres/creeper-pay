import express from 'express';
import helmet from 'helmet';
import path from 'path';
import { mainRouter } from './router';
require('./config/firebase-admin');

const app = express();

const viewsPath = path.join(__dirname, '../views');

app.set('views', viewsPath);
app.set('view engine', 'hbs');

app.use(helmet());
app.use(express.json());

app.use('/', mainRouter);

export { app };
