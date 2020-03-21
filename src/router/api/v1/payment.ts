import express, { Response } from 'express';
import { add } from 'date-fns';
import { Container } from 'typedi';
import { Payment, PaymentsCollection } from './../../../models/payment';
import { User, paymentStatusEnum } from './../../../models/user';
import { Request } from './../../../models/extended-request';
import { isAuthenticated } from '../../../middlewares/auth';
import { gateway } from '../../../config/braintree';
import { UsersCollection } from '../../../models/user';
import WhitelistService from '../../../services/whitelist';

const router = express.Router();
const whitelistService = Container.get<WhitelistService>(WhitelistService);

router.get('/token', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { clientToken } = await gateway.clientToken.generate({});

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
      const amount = process.env.PAYMENT_AMOUNT;
      const paymentDate = new Date();
      const paymentExpirationDate = add(new Date(), {
        days: Number(process.env.PAYMENT_DURATION) || 30,
      });
      const result = await gateway.transaction.sale({
        amount,
        paymentMethodNonce: paymentToken,
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      const userData: Partial<User> = {
        paymentStatus: paymentStatusEnum.active,
        lastPaymentDate: paymentDate,
        paymentExpirationDate,
      };

      const paymentData: Payment = {
        uid: req.uid,
        paymentDate,
        paymentExpirationDate,
        amount: Number(amount),
      };

      await UsersCollection.doc(req.uid).update(userData);
      await PaymentsCollection.doc(result.transaction.id).set(paymentData);

      await whitelistService.addUser(await whitelistService.read(), req.user);

      const user: User = {
        ...req.user,
        ...userData,
      };

      req.user = user;

      return res.status(200).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  },
);

export { router as paymentRouter };
