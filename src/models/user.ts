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

export interface BasicUser {
  username: string;
  email: string;
  password: string;
}

export type paymentStatusType = 'ACTIVE' | 'EXPIRED';
export enum paymentStatusEnum {
  active = 'ACTIVE',
  expired = 'EXPIRED',
}

export const updateableUserFields = ['username', 'email', 'password'];

const env = process.env.NODE_ENV || 'development';
const usersCollection = db.collection(`users_${env}`);
export { usersCollection as UsersCollection };
