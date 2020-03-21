import { db } from '../config/firebase-admin';

export interface User {
  uid: string;
  username: string;
  email: string;
  minecraftUUID: string;
  paymentStatus: paymentStatusType;
  lastPaymentDate: Date;
  paymentExpirationDate: Date;
}

export type paymentStatusType = 'ACTIVE' | 'EXPIRED';
export enum paymentStatusEnum {
  active = 'ACTIVE',
  expired = 'EXPIRED',
}

const usersCollection = db.collection('users');
export { usersCollection as UsersCollection };
