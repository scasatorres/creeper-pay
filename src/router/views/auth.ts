import { Request } from '../../models/extended-request';
import express, { Response } from 'express';
import { authenticatedRedirection } from '../../middlewares/auth-redirection';
import { isAuthenticated } from '../../middlewares/auth';
import { logger } from '../../config/winston';

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

router.get('/logout', isAuthenticated, (req: Request, res: Response) => {
  logger.info(req, req.uid, res);

  res.clearCookie(process.env.COOKIE_NAME);

  res.redirect('/');
});

export { router as authRouter };
