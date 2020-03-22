import { Request } from '../../models/extended-request';
import express, { Response } from 'express';
import { unauthenticatedRedirection } from '../../middlewares/auth-redirection';

const router = express.Router();

router.get('/', unauthenticatedRedirection, (req: Request, res: Response) => {
  return res.render('payment', { amount: process.env.PAYMENT_AMOUNT });
});

export { router as paymentRouter };
