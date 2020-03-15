import { db } from '../config/firebase-admin';

export interface User {
  username: string;
  email: string;
  paymentStatus: paymentStatusType;
  lastPaymentDate: Date;
  paymentExpirationDate: Date;
}

export type paymentStatusType = 'active' | 'expired';

const usersCollection = db.collection('users');
export { usersCollection as UsersCollection };
