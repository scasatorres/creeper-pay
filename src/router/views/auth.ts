import { Request } from '../../models/extended-request';
import express, { Response } from 'express';
import { authenticatedRedirection } from '../../middlewares/auth-redirection';

const router = express.Router();

router.get(
  '/login',
  authenticatedRedirection,
  (req: Request, res: Response) => {
    return res.render('login', { unauthenticated: true });
  },
);

router.get(
  '/signup',
  authenticatedRedirection,
  (req: Request, res: Response) => {
    return res.render('signup', { unauthenticated: true });
  },
);

export { router as authRouter };
