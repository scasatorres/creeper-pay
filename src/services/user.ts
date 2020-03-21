import { BasicUser } from './../models/user';
import got from 'got';
import { Response } from 'express';
import admin from 'firebase-admin';
import * as jwt from 'jsonwebtoken';
import { MinecraftUUID } from './../models/minecraftUUID';
import { Request } from './../models/extended-request';
import { UsersCollection, paymentStatusEnum, User } from '../models/user';

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
    const uuidGeneratorResponse = await got.get(
      `${process.env.UUID_GENERATOR_URL}/${username}`,
    );

    if (!uuidGeneratorResponse.body) {
      throw new Error();
    }

    const uuidGeneratorObj: MinecraftUUID = JSON.parse(
      uuidGeneratorResponse.body,
    );
    const minecraftUUID = uuidGeneratorObj.offlinesplitteduuid;

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
      const uuidGeneratorResponse = await got.get(
        `${process.env.UUID_GENERATOR_URL}/${updatedUserData.username}`,
      );

      if (!uuidGeneratorResponse.body) {
        throw new Error();
      }

      const minecraftUUID: MinecraftUUID = JSON.parse(
        uuidGeneratorResponse.body,
      );

      updatedUserData.minecraftUUID = minecraftUUID.offlinesplitteduuid;
    }

    await UsersCollection.doc(req.uid).update(updatedUserData);

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
