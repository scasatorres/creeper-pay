import { Request } from './../models/extended-request';
import express, { Response } from 'express';
import { apiRouter } from './api';
import { viewsRouter } from './views';

const router = express.Router();

router.get('/', function(req: Request, res: Response) {
  return res.redirect('/views/auth/login');
});

router.use('/views', viewsRouter);
router.use('/api', apiRouter);

router.get('*', (req, res) => {
  return res.redirect('/views/error');
});

export { router as mainRouter };
