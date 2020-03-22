import { Container } from 'typedi';
import { BasicUser } from './../models/user';
import got from 'got';
import { Response } from 'express';
import admin from 'firebase-admin';
import * as jwt from 'jsonwebtoken';
import {
  MinecraftOfflineUUID,
  MinecraftOnlineUUID,
} from '../models/minecraft-uuid';
import { Request } from './../models/extended-request';
import { UsersCollection, paymentStatusEnum, User } from '../models/user';
import WhitelistService from './whitelist';
import MinecraftUUIDService from './minecraft-uuid';

const minecraftUUIDService = Container.get<MinecraftUUIDService>(
  MinecraftUUIDService,
);
const whitelistService = Container.get<WhitelistService>(WhitelistService);

export default class UserService {
  public signup = async (
    req: Request,
    basicUserData: BasicUser,
    res: Response,
  ) => {
    const { username, email, password } = basicUserData;
    const existingUser = await UsersCollection.where(
      'username',
      '==',
      username,
    ).get();

    if (!existingUser.empty) {
      throw new Error('Username already in use!');
    }

    const { uid } = await admin
      .auth()
      .createUser({ email, password, displayName: username });
    const token = jwt.sign({ uid }, process.env.JWT_SECRET);

    const minecraftUUID = await minecraftUUIDService.getUUID(username);

    const user: User = {
      uid,
      username,
      email,
      minecraftUUID,
      paymentStatus: paymentStatusEnum.expired,
      lastPaymentDate: null,
      paymentExpirationDate: new Date(),
    };

    await UsersCollection.doc(uid).set(user);

    req.user = user;
    req.uid = uid;

    res.cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      signed: true,
    });

    return user;
  };

  public login = async (req: Request, uid: string, res: Response) => {
    const userRecord = await admin.auth().getUser(uid);
    const userDocument = await UsersCollection.doc(uid).get();

    if (!userDocument.exists) {
      throw new Error('User not exists!');
    }

    const user: User = {
      ...(userDocument.data() as User),
      email: userRecord.email,
    };

    req.user = user;
    req.uid = uid;

    const token = jwt.sign({ uid }, process.env.JWT_SECRET);

    res.cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      signed: true,
    });

    return user;
  };

  public getCurrentUser = (req: Request) => {
    return req.user;
  };

  public updateCurrentUser = async (req: Request, updatedUserData: User) => {
    await admin.auth().updateUser(req.uid, updatedUserData);

    delete updatedUserData['password'];

    if (updatedUserData.hasOwnProperty('username')) {
      const minecraftUUID = await minecraftUUIDService.getUUID(
        updatedUserData.username,
      );

      updatedUserData.minecraftUUID = minecraftUUID;
    }

    await UsersCollection.doc(req.uid).update(updatedUserData);

    if (updatedUserData.hasOwnProperty('username')) {
      await whitelistService.updateUser(
        updatedUserData,
        req.user,
        await whitelistService.getWhitelistUsers(),
      );
    }

    const user: User = {
      ...req.user,
      ...updatedUserData,
    };

    req.user = user;

    return user;
  };

  public deleteUser = async (req: Request, res: Response) => {
    await admin.auth().deleteUser(req.uid);
    await UsersCollection.doc(req.uid).delete();
    await whitelistService.removeUser(
      req.user,
      await whitelistService.getWhitelistUsers(),
    );

    delete req.user;
    delete req.uid;

    res.clearCookie(process.env.COOKIE_NAME);
  };

  public getExpiredPaymentUsers = async () => {
    const usersData = await UsersCollection.where(
      'paymentExpirationDate',
      '<',
      new Date(),
    )
      .where('paymentStatus', '==', paymentStatusEnum.active)
      .get();

    return usersData.docs.map(userData => userData.data()) as User[];
  };

  public updatePaymentStatus = async (user: User) => {
    user.paymentStatus = paymentStatusEnum.expired;

    return UsersCollection.doc(user.uid).update(user);
  };
}
