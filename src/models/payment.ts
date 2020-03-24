import { db } from '../config/firebase-admin';

export interface Payment {
  uid: string;
  amount: number;
  paymentDate: Date;
  paymentExpirationDate: Date;
}

const env = process.env.NODE_ENV || 'development';
const paymentsCollection = db.collection(`payments_${env}`);
export { paymentsCollection as PaymentsCollection };
