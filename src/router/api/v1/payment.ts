import express, { Response } from 'express';
import { Container } from 'typedi';
import { Request } from './../../../models/extended-request';
import { isAuthenticated } from '../../../middlewares/auth';
import PaymentService from '../../../services/payment';
import { logger } from '../../../config/winston';

const router = express.Router();
const paymentService = Container.get<PaymentService>(PaymentService);

router.get(
  '/payment-amount',
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const amount = paymentService.getCurrentPrice();

      logger.info(req, req.uid, res);
      return res.status(200).send({ amount });
    } catch (error) {
      res.status(500);
      logger.error(req, req.uid, res, error);
      return res.send(error);
    }
  },
);

router.get(
  '/funding-sources',
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const fundingSources = paymentService.getFundingSources();

      logger.info(req, req.uid, res);
      return res.status(200).send({ fundingSources });
    } catch (error) {
      res.status(500);
      logger.error(req, req.uid, res, error);
      return res.send(error);
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

      logger.info(req, req.uid, res);
      return res.status(200).send();
    } catch (error) {
      res.status(500);
      logger.error(req, req.uid, res, error);
      return res.send(error);
    }
  },
);

export { router as paymentRouter };
