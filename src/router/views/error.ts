import { Request } from '../../models/extended-request';
import express, { Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  return res.render('error', {
    errorTitle: '404',
    errorMessage: 'Page not found',
  });
});

export { router as errorRouter };
