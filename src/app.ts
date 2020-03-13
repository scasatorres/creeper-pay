import express from 'express';
import helmet from 'helmet';
import mainRouter from './router/index';

const app = express();

app.use(helmet());
app.use(express.json());

app.use('/', mainRouter);

export default app;
