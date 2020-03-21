import { Container } from 'typedi';
import { add } from 'date-fns';
import { Payment, PaymentsCollection } from './../models/payment';
import { paymentStatusEnum, User, UsersCollection } from './../models/user';
import { Request } from './../models/extended-request';
import { gateway } from '../config/braintree';
import WhitelistService from './whitelist';

const whitelistService = Container.get<WhitelistService>(WhitelistService);

export default class PaymentService {
  public getClientToken = async () => {
    const { clientToken } = await gateway.clientToken.generate({});

    return clientToken;
  };

  public checkout = async (req: Request, paymentToken: string) => {
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

    await whitelistService.addUser(
      req.user,
      await whitelistService.getWhitelistUsers(),
    );

    req.user = {
      ...req.user,
      ...userData,
    };
  };
}
