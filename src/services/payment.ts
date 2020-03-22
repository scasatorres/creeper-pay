import { Container } from 'typedi';
import { add } from 'date-fns';
import * as checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { Payment, PaymentsCollection } from './../models/payment';
import { paymentStatusEnum, User, UsersCollection } from './../models/user';
import { Request } from './../models/extended-request';
import { gateway } from '../config/braintree';
import WhitelistService from './whitelist';
import { payPalClient } from '../config/paypal';

const whitelistService = Container.get<WhitelistService>(WhitelistService);

export default class PaymentService {
  public getCurrentPrice = () => {
    return process.env.PAYMENT_AMOUNT || '3.50';
  };

  public getClientToken = async () => {
    const { clientToken } = await gateway.clientToken.generate({});

    return clientToken;
  };

  public checkout = async (req: Request, paymentToken: string) => {
    const amount = process.env.PAYMENT_AMOUNT;
    const result = await gateway.transaction.sale({
      amount,
      paymentMethodNonce: paymentToken,
    });

    if (!result.success) {
      throw new Error(result.message);
    }

    const transactionId = result.transaction.id;

    await this._updatePaymentData(req, transactionId);
  };

  public paypalCheckout = async (req: Request, orderId: string) => {
    const amount = process.env.PAYMENT_AMOUNT;
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await payPalClient().execute(request);
    const {
      id: captureId,
      amount: captureAmount,
    } = capture.result.purchase_units[0].payments.captures[0];

    if (
      captureAmount.value !== amount &&
      captureAmount.currency_code !== 'EUR'
    ) {
      throw new Error();
    }

    await this._updatePaymentData(req, captureId);
  };

  private _updatePaymentData = async (req: Request, paymentId: string) => {
    const amount = process.env.PAYMENT_AMOUNT;
    const paymentDate = new Date();
    const paymentExpirationDate = add(new Date(), {
      days: Number(process.env.PAYMENT_DURATION) || 30,
    });
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
    await PaymentsCollection.doc(paymentId).set(paymentData);

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
