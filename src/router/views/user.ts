import { Request } from '../../models/extended-request';
import express, { Response } from 'express';
import { unauthenticatedRedirection } from '../../middlewares/auth-redirection';

const router = express.Router();

router.get(
  '/account',
  unauthenticatedRedirection,
  (req: Request, res: Response) => {
    return res.render('account');
  },
);

export { router as userRouter };
