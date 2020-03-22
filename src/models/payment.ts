import { db } from '../config/firebase-admin';

export interface Payment {
  uid: string;
  amount: number;
  paymentDate: Date;
  paymentExpirationDate: Date;
}

const paymentsCollection = db.collection('payments');
export { paymentsCollection as PaymentsCollection };
