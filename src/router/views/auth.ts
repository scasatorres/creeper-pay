import { Request } from '../../models/extended-request';
import express, { Response } from 'express';

const router = express.Router();

router.get('/login', (req: Request, res: Response) => {
  return res.render('login');
});

export { router as authRouter };
