import express, { Response } from 'express';
import { Container } from 'typedi';
import { Request } from './../../../models/extended-request';
import { isAuthenticated } from '../../../middlewares/auth';
import PaymentService from '../../../services/payment';

const router = express.Router();
const paymentService = Container.get<PaymentService>(PaymentService);

router.get(
  '/payment-amount',
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const amount = paymentService.getCurrentPrice();

      return res.status(200).send({ amount });
    } catch (error) {
      return res.status(500).send(error);
    }
  },
);

router.get('/token', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const clientToken = await paymentService.getClientToken();

    return res.status(200).send({ clientToken });
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post(
  '/checkout',
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const { paymentToken } = req.body;

      await paymentService.checkout(req, paymentToken);

      return res.status(200).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  },
);

router.post(
  '/paypal-checkout',
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const { orderID } = req.body;

      await paymentService.paypalCheckout(req, orderID);

      return res.status(200).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  },
);

export { router as paymentRouter };
